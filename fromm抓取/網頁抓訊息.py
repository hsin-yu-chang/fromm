# -*- coding: utf-8 -*-
"""
Tistory 聊天訊息抓取器
------------------------------------------------------------
功能：
1. 從 https://hyunjae-message.tistory.com 的文章列表抓每日文章
2. 進入每天文章，解析 #raw-data p 中的 JSON
3. 轉成 Fromm 專案目前使用的 JSON 格式：

4. 圖片 / 影片 / 音訊會額外加入：
   "url": "https://..."

5. 支援：
   - 指定開始 / 結束日期
   - 中斷後續抓
   - 已抓日期自動跳過
   - 可強制重抓
   - 每抓完一天立即存檔
   - 最後依日期、時間排序並重新編 msg0001...
------------------------------------------------------------

需要套件：
    pip install requests beautifulsoup4

使用方式：

    直接執行：
        python tistory_to_fromm_json.py

    指定日期：
        python tistory_to_fromm_json.py --start 2021-01-29 --end 2021-12-31

    指定輸出：
        python tistory_to_fromm_json.py --output hyunjae_2021.json

    強制重抓已有日期：
        python tistory_to_fromm_json.py --force

    只掃前 20 頁：
        python tistory_to_fromm_json.py --max-pages 20
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


# ============================================================
# 可直接修改的設定
# ============================================================

BASE_URL = "https://hyunjae-message.tistory.com"

# 你的 Fromm JSON 裡希望固定顯示的 sender。
# 若想沿用原網站 item.name，改成 None。
SENDER_OVERRIDE = "현재"

DEFAULT_OUTPUT = "hj_bubble.json"

REQUEST_TIMEOUT = 20
REQUEST_INTERVAL = 0.35
RETRY_COUNT = 3

# 網站目前首頁顯示共有 112 頁，這裡設高一點，
# 程式若遇到沒有文章的頁面會自動停止。
DEFAULT_MAX_PAGES = 200

MEDIA_EXTENSIONS = {
    "jpg", "jpeg", "png", "gif", "webp",
    "mp4", "webm", "mov",
    "mp3", "wav", "ogg", "m4a"
}


# ============================================================
# HTTP
# ============================================================

def build_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/151.0 Safari/537.36"
        ),
        "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
    })
    return session


def get_text(session: requests.Session, url: str) -> str:
    last_error = None

    for attempt in range(1, RETRY_COUNT + 1):
        try:
            response = session.get(url, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            response.encoding = response.apparent_encoding or response.encoding
            return response.text

        except requests.RequestException as exc:
            last_error = exc
            if attempt < RETRY_COUNT:
                print(f"  [重試 {attempt}/{RETRY_COUNT}] {url}")
                time.sleep(1.2 * attempt)

    raise RuntimeError(f"讀取失敗：{url}\n{last_error}")


# ============================================================
# 日期 / 時間
# ============================================================

def normalize_date(value: str | None) -> str | None:
    if not value:
        return None

    value = value.strip()

    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%Y.%m.%d"):
        try:
            return datetime.strptime(value, fmt).strftime("%Y-%m-%d")
        except ValueError:
            pass

    raise ValueError(f"日期格式錯誤：{value}，請使用 YYYY-MM-DD")


def parse_korean_date(text: str) -> str | None:
    """
    支援：
      23년 12월 31일
      2023년 12월 31일
    """
    m = re.search(r"(\d{2,4})년\s*(\d{1,2})월\s*(\d{1,2})일", text)
    if not m:
        return None

    year = int(m.group(1))
    month = int(m.group(2))
    day = int(m.group(3))

    if year < 100:
        year += 2000

    try:
        return datetime(year, month, day).strftime("%Y-%m-%d")
    except ValueError:
        return None


def normalize_message_time(value: str) -> str:
    """
    統一輸出 24 小時制。
    支援：
      5:53 / 05:53 / 05:53:30
      오전 05:53 / 오후 05:53
      AM 5:53 / PM 5:53
    秒數若原本有就保留；沒有就輸出 HH:MM。
    """
    raw = str(value or "").strip()
    if not raw:
        return ""

    # 24 小時制
    m = re.match(r"^(\d{1,2}):(\d{2})(?::(\d{2}))?$", raw)
    if m:
        h = int(m.group(1))
        minute = int(m.group(2))
        sec = m.group(3)

        if 0 <= h <= 23 and 0 <= minute <= 59:
            if sec is not None:
                return f"{h:02d}:{minute:02d}:{int(sec):02d}"
            return f"{h:02d}:{minute:02d}"

    # 沒有冒號的 24 小時制：
    # 1200 -> 12:00
    # 1201 -> 12:01
    # 0530 -> 05:30
    # 930  -> 09:30
    m = re.match(r"^(\d{3,4})$", raw)
    if m:
        digits = m.group(1)

        if len(digits) == 3:
            h = int(digits[0])
            minute = int(digits[1:])
        else:
            h = int(digits[:2])
            minute = int(digits[2:])

        if 0 <= h <= 23 and 0 <= minute <= 59:
            return f"{h:02d}:{minute:02d}"

    # 韓文 오전 / 오후
    m = re.match(r"^(오전|오후)\s*(\d{1,2}):(\d{2})(?::(\d{2}))?$", raw)
    if m:
        meridiem = m.group(1)
        h = int(m.group(2))
        minute = int(m.group(3))
        sec = m.group(4)

        if meridiem == "오전":
            if h == 12:
                h = 0
        else:
            if h != 12:
                h += 12

        if sec is not None:
            return f"{h:02d}:{minute:02d}:{int(sec):02d}"
        return f"{h:02d}:{minute:02d}"

    # 英文 AM / PM
    m = re.match(r"^(AM|PM)\s*(\d{1,2}):(\d{2})(?::(\d{2}))?$", raw, re.I)
    if m:
        meridiem = m.group(1).upper()
        h = int(m.group(2))
        minute = int(m.group(3))
        sec = m.group(4)

        if meridiem == "AM":
            if h == 12:
                h = 0
        else:
            if h != 12:
                h += 12

        if sec is not None:
            return f"{h:02d}:{minute:02d}:{int(sec):02d}"
        return f"{h:02d}:{minute:02d}"

    # 看不懂的格式先原樣保留，避免資料消失
    return raw


def time_sort_key(value: str) -> tuple[int, int, int, str]:
    """
    統一轉成 24 小時制後排序。
    """
    raw = normalize_message_time(value)
    m = re.match(r"^(\d{2}):(\d{2})(?::(\d{2}))?$", raw)

    if not m:
        return (99, 99, 99, raw)

    return (
        int(m.group(1)),
        int(m.group(2)),
        int(m.group(3) or 0),
        raw
    )


# ============================================================
# 找文章
# ============================================================

def get_article_links(
    session: requests.Session,
    page: int
) -> list[dict[str, str]]:
    url = f"{BASE_URL}/?page={page}"
    html = get_text(session, url)
    soup = BeautifulSoup(html, "html.parser")

    result: list[dict[str, str]] = []
    seen_urls: set[str] = set()

    # 這是目前首頁文章卡片的 class
    for a in soup.select("a.post-item"):
        href = (a.get("href") or "").strip()
        title_el = a.select_one(".post-item-title")

        if not href or not title_el:
            continue

        title = title_el.get_text(" ", strip=True)
        date = parse_korean_date(title)

        if not date:
            continue

        full_url = urljoin(BASE_URL, href)

        if full_url in seen_urls:
            continue

        seen_urls.add(full_url)
        result.append({
            "date": date,
            "url": full_url,
            "title": title,
        })

    return result


def collect_articles(
    session: requests.Session,
    start_date: str | None,
    end_date: str | None,
    max_pages: int
) -> list[dict[str, str]]:
    articles: list[dict[str, str]] = []
    seen_urls: set[str] = set()
    empty_pages = 0

    for page in range(1, max_pages + 1):
        print(f"[列表] 第 {page} 頁")

        try:
            links = get_article_links(session, page)
        except Exception as exc:
            print(f"  !! 第 {page} 頁讀取失敗：{exc}")
            continue

        if not links:
            empty_pages += 1
            print("  沒有找到文章")

            # 連續 2 頁沒文章就停止，避免無限掃描
            if empty_pages >= 2:
                break

            continue

        empty_pages = 0

        for article in links:
            date = article["date"]

            if start_date and date < start_date:
                continue
            if end_date and date > end_date:
                continue

            if article["url"] in seen_urls:
                continue

            seen_urls.add(article["url"])
            articles.append(article)

        time.sleep(REQUEST_INTERVAL)

    # 舊 -> 新
    articles.sort(key=lambda x: (x["date"], x["url"]))
    return articles


# ============================================================
# 解析 #raw-data
# ============================================================

def clean_raw_json(text: str) -> str:
    """
    清理網站 #raw-data 裡常見的非標準 JSON。
    包含：
      - 多餘的 *
      - object 黏在一起
      - ] 或 } 前面的尾逗號
    """
    text = text.strip()
    text = text.lstrip("\ufeff")

    replacements = [
        (r"},\s*\*}", "}"),
        (r",\s*\*]", "]"),
        (r",\s*\*,", ","),
        (r"}\s*,\s*\*}", "},{"),
        (r"}\s*{", "},{"),
    ]

    for pattern, repl in replacements:
        text = re.sub(pattern, repl, text)

    # 修正最常見的錯誤：最後一筆後面多逗號
    # {...}, ]  -> {...} ]
    # "x": 1, } -> "x": 1 }
    text = re.sub(r",\s*]", "]", text)
    text = re.sub(r",\s*}", "}", text)

    stripped = text.strip()

    if stripped.startswith("{") and stripped.endswith("}"):
        text = f"[{stripped}]"

    return text


def parse_raw_data_from_article(html: str) -> list[dict[str, Any]]:
    soup = BeautifulSoup(html, "html.parser")

    candidates = [
        soup.select_one("#raw-data p"),
        soup.select_one("#raw-data .tt_article_useless_p_margin"),
        soup.select_one("#raw-data"),
    ]

    raw_text = ""

    for el in candidates:
        if not el:
            continue

        candidate = el.get_text("", strip=True)
        if candidate:
            raw_text = candidate
            break

    if not raw_text:
        raise ValueError("找不到 #raw-data 內容")

    cleaned = clean_raw_json(raw_text)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        pos = exc.pos
        start = max(0, pos - 250)
        end = min(len(cleaned), pos + 250)
        problem = cleaned[start:end]

        raise ValueError(
            f"#raw-data JSON 解析失敗：{exc}\n"
            f"錯誤位置：{pos}\n"
            f"錯誤附近內容：\n{problem}"
        ) from exc

    if isinstance(data, dict):
        data = [data]

    if not isinstance(data, list):
        raise ValueError("#raw-data 解析後不是 list")

    return [item for item in data if isinstance(item, dict)]


# ============================================================
# 轉成 Fromm JSON
# ============================================================

def is_media_url(value: str) -> bool:
    raw = str(value or "").strip()
    if not raw:
        return False

    # 去掉 query / fragment
    no_query = raw.split("?", 1)[0].split("#", 1)[0]
    m = re.search(r"\.([A-Za-z0-9]+)$", no_query)

    if not m:
        return False

    return m.group(1).lower() in MEDIA_EXTENSIONS


def normalize_content_list(content: Any) -> list[str]:
    if content is None:
        return []

    if isinstance(content, list):
        result = []
        for item in content:
            if item is None:
                continue
            result.append(str(item).strip())
        return result

    return [str(content).strip()]


def convert_items(
    raw_items: list[dict[str, Any]],
    date: str
) -> list[dict[str, Any]]:
    messages: list[dict[str, Any]] = []

    for item in raw_items:
        original_sender = str(item.get("name", "") or "").strip()
        sender = SENDER_OVERRIDE if SENDER_OVERRIDE is not None else original_sender
        time_value = normalize_message_time(item.get("time", ""))

        contents = normalize_content_list(item.get("content"))

        # content 為空仍可略過
        if not contents:
            continue

        for content in contents:
            if not content:
                continue

            msg: dict[str, Any] = {
                "id": "",
                "date": date,
                "time": time_value,
                "sender": sender,
                "text": "",
                "trans": ""
            }

            if is_media_url(content):
                msg["url"] = content
            else:
                msg["text"] = content

            messages.append(msg)

    # 保留同一時間的原始順序
    indexed = list(enumerate(messages))
    indexed.sort(key=lambda pair: (time_sort_key(pair[1].get("time", "")), pair[0]))
    return [msg for _, msg in indexed]


def fetch_day_messages(
    session: requests.Session,
    article_url: str,
    date: str
) -> list[dict[str, Any]]:
    html = get_text(session, article_url)
    raw_items = parse_raw_data_from_article(html)
    return convert_items(raw_items, date)


# ============================================================
# 輸出 / 續抓
# ============================================================

def load_existing(path: Path) -> dict[str, list[dict[str, Any]]]:
    if not path.exists():
        return {}

    try:
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as exc:
        raise RuntimeError(f"既有 JSON 讀取失敗：{path}\n{exc}") from exc

    if not isinstance(data, dict):
        raise RuntimeError("既有輸出檔最外層不是 JSON object")

    result: dict[str, list[dict[str, Any]]] = {}

    for date, items in data.items():
        if isinstance(items, list):
            normalized_items = []

            for item in items:
                if isinstance(item, dict):
                    item = dict(item)
                    item["time"] = normalize_message_time(item.get("time", ""))
                normalized_items.append(item)

            result[str(date)] = normalized_items

    return result


def reindex_messages(data: dict[str, list[dict[str, Any]]]) -> None:
    """
    日期舊 -> 新、時間舊 -> 新，統一重編 id。
    """
    counter = 1

    for date in sorted(data.keys()):
        items = data[date]

        indexed = list(enumerate(items))
        indexed.sort(
            key=lambda pair: (
                time_sort_key(pair[1].get("time", "")),
                pair[0]
            )
        )
        sorted_items = [msg for _, msg in indexed]
        data[date] = sorted_items

        for msg in sorted_items:
            msg["id"] = f"msg{counter:04d}"
            counter += 1


def save_output(
    path: Path,
    data: dict[str, list[dict[str, Any]]]
) -> None:
    reindex_messages(data)

    ordered_dates = sorted(data.keys())
    temp_path = path.with_suffix(path.suffix + ".tmp")

    with temp_path.open("w", encoding="utf-8") as f:
        f.write("{\n")

        for date_index, date in enumerate(ordered_dates):
            f.write(f'  {json.dumps(date, ensure_ascii=False)}: [\n')

            messages = data[date]

            for msg_index, msg in enumerate(messages):
                msg_text = json.dumps(
                    msg,
                    ensure_ascii=False,
                    separators=(",", ": ")
                )

                comma = "," if msg_index < len(messages) - 1 else ""
                f.write(f"    {msg_text}{comma}\n")

            date_comma = "," if date_index < len(ordered_dates) - 1 else ""
            f.write(f"  ]{date_comma}\n")

        f.write("}\n")

    temp_path.replace(path)


# ============================================================
# 主流程
# ============================================================

def run(
    output: Path,
    start_date: str | None = None,
    end_date: str | None = None,
    max_pages: int = DEFAULT_MAX_PAGES,
    force: bool = False
) -> None:
    start_date = normalize_date(start_date)
    end_date = normalize_date(end_date)

    if start_date and end_date and start_date > end_date:
        raise ValueError("開始日期不能晚於結束日期")

    output = output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    print("=" * 65)
    print("Tistory → Fromm JSON")
    print(f"網站：{BASE_URL}")
    print(f"輸出：{output}")
    print(f"開始：{start_date or '不限'}")
    print(f"結束：{end_date or '不限'}")
    print(f"sender：{SENDER_OVERRIDE or '使用原網站 name'}")
    print(f"強制重抓：{'是' if force else '否'}")
    print("=" * 65)

    session = build_session()
    existing = load_existing(output)

    print(f"\n既有資料：{len(existing)} 天")

    print("\n開始掃描文章列表...")
    articles = collect_articles(
        session=session,
        start_date=start_date,
        end_date=end_date,
        max_pages=max_pages
    )

    if not articles:
        print("\n沒有找到符合條件的文章。")
        return

    print(f"\n找到 {len(articles)} 篇文章。")

    success = 0
    skipped = 0
    failed = 0

    for i, article in enumerate(articles, start=1):
        date = article["date"]
        url = article["url"]

        if not force and date in existing and existing[date]:
            print(f"[{i}/{len(articles)}] 跳過 {date}（已有資料）")
            skipped += 1
            continue

        print(f"[{i}/{len(articles)}] 抓取 {date}")
        print(f"  {url}")

        try:
            messages = fetch_day_messages(
                session=session,
                article_url=url,
                date=date
            )

            if not messages:
                print("  !! 沒有解析到訊息")
                failed += 1
                continue

            existing[date] = messages

            # 每抓完一天就立即存檔，中斷後可續抓
            save_output(output, existing)

            print(f"  OK：{len(messages)} 筆")
            success += 1

        except KeyboardInterrupt:
            print("\n\n使用者中斷。已抓成功的日期都已存檔。")
            save_output(output, existing)
            return

        except Exception as exc:
            print(f"  !! 失敗：{exc}")
            failed += 1

        time.sleep(REQUEST_INTERVAL)

    # 最後再整理一次
    save_output(output, existing)

    total_messages = sum(len(v) for v in existing.values())

    print("\n" + "=" * 65)
    print("完成")
    print(f"本次成功：{success} 天")
    print(f"本次跳過：{skipped} 天")
    print(f"本次失敗：{failed} 天")
    print(f"目前總天數：{len(existing)}")
    print(f"目前總訊息：{total_messages}")
    print(f"輸出檔：{output}")
    print("=" * 65)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="抓取 Tistory 每日聊天內容並轉成 Fromm JSON"
    )

    parser.add_argument(
        "--start",
        help="開始日期 YYYY-MM-DD，例如 2021-01-29"
    )

    parser.add_argument(
        "--end",
        help="結束日期 YYYY-MM-DD，例如 2021-12-31"
    )

    parser.add_argument(
        "--output",
        default=DEFAULT_OUTPUT,
        help=f"輸出 JSON，預設：{DEFAULT_OUTPUT}"
    )

    parser.add_argument(
        "--max-pages",
        type=int,
        default=DEFAULT_MAX_PAGES,
        help=f"最多掃描列表頁數，預設：{DEFAULT_MAX_PAGES}"
    )

    parser.add_argument(
        "--force",
        action="store_true",
        help="已有日期也重新抓取"
    )

    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()

    try:
        run(
            output=Path(args.output),
            start_date="2023-02-17",
            end_date="2024-12-15",
            max_pages=args.max_pages,
            force=args.force
        )

    except KeyboardInterrupt:
        print("\n已中止。")
        sys.exit(130)

    except Exception as exc:
        print(f"\n[錯誤] {exc}")
        sys.exit(1)