import csv
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path


# 程式所在資料夾
BASE_DIR = Path(__file__).resolve().parent

# ====== 你改這裡：放你的三個資料夾路徑 ======
FOLDERS = [
    BASE_DIR / "fromm_dump" / "01",
    BASE_DIR / "fromm_dump" / "02",
    BASE_DIR / "fromm_dump" / "03",
]

# 輸出到程式同一個資料夾
OUTPUT_CSV = BASE_DIR / "fromm_messages_translated_001_2980.csv"
OUTPUT_JSON = BASE_DIR / "fromm_messages_translated_001_2980.json"


SENDER_NAMES = {
    "선우",
    # "현재",
    # "영훈",
}

# CSV/JSON 裡要顯示的正式 sender 名稱
SENDER_MAP = {
    "선우": "김선우",
    # "현재": "이재현",
    # "영훈": "김영훈",
}


TIME_RE = re.compile(r"^(AM|PM)\s+\d{1,2}:\d{2}$")

DATE_RE_LIST = [
    re.compile(r"^\d{4}\.\d{1,2}\.\d{1,2}$"),
    re.compile(r"^\d{4}-\d{1,2}-\d{1,2}$"),
    re.compile(r"^\d{1,2}/\d{1,2}/\d{4}$"),
]


IGNORE_TEXTS = {
    "還能傳送5條",
    "translate",
    "back",
    "search",
    "setting",
    "go_to_bottom",
    "emoticon",
}


def parse_bounds(bounds: str):
    nums = list(map(int, re.findall(r"\d+", bounds)))
    if len(nums) == 4:
        return nums
    return [0, 0, 0, 0]


def is_date_text(text: str) -> bool:
    text = text.strip()
    return any(p.match(text) for p in DATE_RE_LIST)


def is_time_text(text: str) -> bool:
    return bool(TIME_RE.match(text.strip()))


def normalize_date(date_text: str) -> str:
    """
    2023.2.17 -> 2023-02-17
    2023-2-17 -> 2023-02-17
    """
    date_text = str(date_text).strip()

    if not date_text:
        return ""

    m = re.match(r"^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$", date_text)
    if not m:
        return date_text

    y, mo, d = m.groups()
    return f"{int(y):04d}-{int(mo):02d}-{int(d):02d}"


def convert_time_to_24h(time_text: str) -> str:
    """
    AM 9:04 -> 09:04
    PM 10:29 -> 22:29
    """
    time_text = str(time_text).strip()

    m = re.match(r"^(AM|PM)\s+(\d{1,2}):(\d{2})$", time_text)
    if not m:
        return time_text

    ampm, hour, minute = m.groups()
    hour = int(hour)

    if ampm == "AM":
        if hour == 12:
            hour = 0
    else:
        if hour != 12:
            hour += 12

    return f"{hour:02d}:{minute}"


def read_xml_text_nodes(xml_path: Path):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    nodes = []

    for node in root.iter("node"):
        text = node.attrib.get("text", "").strip()
        content_desc = node.attrib.get("content-desc", "").strip()
        class_name = node.attrib.get("class", "")
        bounds = node.attrib.get("bounds", "")

        value = text or content_desc
        if not value:
            continue

        if value in IGNORE_TEXTS:
            continue

        x1, y1, x2, y2 = parse_bounds(bounds)

        # 過濾上方 header
        if y2 < 200:
            continue

        # 過濾下方輸入框
        if y1 > 2050:
            continue

        nodes.append({
            "text": value,
            "class": class_name,
            "bounds": bounds,
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2,
        })

    nodes.sort(key=lambda n: (n["y1"], n["x1"]))
    return nodes


def parse_messages_from_nodes(nodes, source_file):
    """
    從排序後的節點抽出：
    sender -> message -> time

    遇到 sender 後面直接是 AM/PM 時間時，不會卡住。
    會視為圖片、影片、貼圖或 XML 抓不到文字。
    """
    results = []
    current_date = ""

    i = 0
    while i < len(nodes):
        text = nodes[i]["text"]

        if is_date_text(text):
            current_date = text
            i += 1
            continue

        if text not in SENDER_NAMES:
            i += 1
            continue

        sender = text
        j = i + 1

        # sender 後面沒東西
        if j >= len(nodes):
            i += 1
            continue

        next_text = nodes[j]["text"]

        # sender 後面又是 sender，跳過避免卡住
        if next_text in SENDER_NAMES:
            i += 1
            continue

        # sender 後面直接是時間，通常是圖片/影片/貼圖
        if is_time_text(next_text):
            results.append({
                "date": current_date,
                "time": next_text,
                "sender": sender,
                "message": "[media/no text]",
                "source_file": str(source_file),
            })
            i = j + 1
            continue

        # sender 後面是日期
        if is_date_text(next_text):
            current_date = next_text
            i = j + 1
            continue

        # 正常情況：sender 後面是訊息文字
        message = next_text

        # 往後找時間
        k = j + 1
        msg_time = ""

        while k < len(nodes):
            kt = nodes[k]["text"]

            if kt in SENDER_NAMES:
                break

            if is_date_text(kt):
                current_date = kt
                k += 1
                continue

            if is_time_text(kt):
                msg_time = kt
                break

            k += 1

        results.append({
            "date": current_date,
            "time": msg_time,
            "sender": sender,
            "message": message,
            "source_file": str(source_file),
        })

        if k > i:
            i = k + 1
        else:
            i += 1

    return results


def dedupe_messages(messages):
    seen = set()
    deduped = []

    for m in messages:
        key = (
            m["date"],
            m["time"],
            m["sender"],
            m["message"],
        )

        if key in seen:
            continue

        seen.add(key)
        deduped.append(m)

    return deduped


def xml_to_csv():
    all_messages = []

    for folder in FOLDERS:
        folder_path = Path(folder)

        if not folder_path.exists():
            print(f"[略過] 找不到資料夾：{folder_path}")
            continue

        xml_files = sorted(folder_path.glob("*.xml"))

        print(f"[讀取] {folder_path}，找到 {len(xml_files)} 個 XML")

        for xml_file in xml_files:
            try:
                nodes = read_xml_text_nodes(xml_file)
                messages = parse_messages_from_nodes(nodes, xml_file)
                all_messages.extend(messages)
                print(f"  - {xml_file.name}: 抽到 {len(messages)} 則")
            except Exception as e:
                print(f"  - {xml_file.name}: 失敗，原因：{e}")

    all_messages = dedupe_messages(all_messages)

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["date", "time", "sender", "message", "source_file"]
        )
        writer.writeheader()

        for m in all_messages:
            writer.writerow({
                "date": normalize_date(m["date"]),
                "time": convert_time_to_24h(m["time"]),
                "sender": SENDER_MAP.get(m["sender"], m["sender"]),
                "message": m["message"],
                "source_file": m["source_file"],
            })

    print()
    print(f"XML 轉 CSV 完成，共輸出 {len(all_messages)} 則")
    print(f"CSV 檔案：{OUTPUT_CSV}")

def dump_chat_json_compact(grouped, output_path):
    """
    輸出格式：
    {
      "2023-02-17": [
        {"id":"msg0001","date":"...","time":"...","sender":"...","text":"...","trans":""},
        {"id":"msg0002","date":"...","time":"...","sender":"...","text":"...","trans":""}
      ],
      "2023-02-18": [
        ...
      ]
    }
    """
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("{\n")

        date_items = list(grouped.items())

        for date_index, (date_key, messages) in enumerate(date_items):
            f.write(f'  {json.dumps(date_key, ensure_ascii=False)}: [\n')

            for msg_index, item in enumerate(messages):
                line = json.dumps(
                    item,
                    ensure_ascii=False,
                    separators=(",", ":")
                )

                if msg_index < len(messages) - 1:
                    line += ","

                f.write(f"    {line}\n")

            f.write("  ]")

            if date_index < len(date_items) - 1:
                f.write(",")

            f.write("\n")

        f.write("}\n")

def csv_to_json():
    if not OUTPUT_CSV.exists():
        print(f"[錯誤] 找不到 CSV：{OUTPUT_CSV}")
        print("請先執行 1：XML 轉 CSV")
        return

    grouped = {}
    counter = 1

    with open(OUTPUT_CSV, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)

        for row in reader:
            date = normalize_date(row.get("date", ""))
            time = convert_time_to_24h(row.get("time", ""))
            sender = row.get("sender", "").strip()
            text = row.get("message", "").strip()
            trans = row.get("trans", "").strip()

            # 圖片/影片/貼圖沒有文字，先不放進 JSON
            if not text:
                continue

            if text == "[media/no text]":
                continue

            date_key = date if date else "unknown_date"

            item = {
                "id": f"msg{counter:04d}",
                "date": date,
                "time": time,
                "sender": sender,
                "text": text,
                "trans": trans
            }

            grouped.setdefault(date_key, []).append(item)
            counter += 1

    dump_chat_json_compact(grouped, OUTPUT_JSON)

    total = sum(len(v) for v in grouped.values())

    print()
    print(f"CSV 轉 JSON 完成，共輸出 {total} 則")
    print(f"JSON 檔案：{OUTPUT_JSON}")


def main():
    print("請選擇功能：")
    print("1 = XML 轉 CSV")
    print("2 = CSV 轉 JSON")
    print("3 = XML 轉 CSV 再轉 JSON")
    print()

    choice = input("請輸入 1 / 2 / 3：").strip()

    if choice == "1":
        xml_to_csv()
    elif choice == "2":
        csv_to_json()
    elif choice == "3":
        xml_to_csv()
        csv_to_json()
    else:
        print("輸入錯誤，請輸入 1、2 或 3")


if __name__ == "__main__":
    main()