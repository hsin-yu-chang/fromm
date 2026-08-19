# -*- coding: utf-8 -*-

import json
import time
from pathlib import Path

from ntu_easy_llm import ask_chatgpt


# ============================================================
# 設定
# ============================================================

INPUT_FILE = Path(r"hj_universe.json")

OUTPUT_FILE = Path(r"C:\Users\znzn8\Desktop\project\fromm\messages\hj_universe.json")

MODEL_NAME = "gpt-5.6-luna"

# 每翻完一天停幾秒，避免 API 打太快
SLEEP_SECONDS = 0.5


# ============================================================
# Prompt
# ============================================================

MEMBER_NAMES = """
【THE BOYZ 成員姓名對照】
- 李上淵
- Jacob（裴俊英）
- 金泳勳
- 李在賢（賢在）
- 李柱延
- Kevin（文炯書）
- 崔燦喜（New）
- 池昌民（Q）
- 周鶴年
- 金善旴
- 孫英宰
"""


def build_prompt(date, messages):
    """
    一次把同一天的所有文字訊息送給模型。
    模型只需要回傳：
    {
      "msg0001": "中文",
      "msg0002": "中文"
    }
    """

    day_messages = []

    for msg in messages:
        text = str(msg.get("text", "") or "").strip()

        if not text:
            continue

        day_messages.append({
            "id": msg.get("id", ""),
            "time": msg.get("time", ""),
            "sender": msg.get("sender", ""),
            "text": text
        })

    json_text = json.dumps(
        day_messages,
        ensure_ascii=False,
        separators=(",", ":")
    )

    return f"""
你是專門翻譯 THE BOYZ Bubble 私訊的韓文翻譯助手。

請將以下同一天的聊天訊息視為一段連續對話，依照前後文翻譯成自然、口語的台灣繁體中文。

{MEMBER_NAMES}

【翻譯規則】

1. 請根據同一天訊息的前後文翻譯，不要把每一句完全獨立處理。

2. 只翻譯每筆資料中的 `text`。

3. 翻譯結果使用自然、口語的台灣繁體中文，保留 Bubble 私訊聊天的語氣。

4. 不要翻得過度正式或像書面文章。

5. `OO` 必須原樣保留成 `OO`，禁止自行替換成姓名、暱稱或其他文字。

6. THE BOYZ 成員姓名、暱稱、簡稱如果可以明確判斷，請依照上面的成員姓名對照翻譯。

7. `ㅋㅋ`、`ㅎㅎ`、`ㅠㅠ`、`ㅜㅜ`、表情符號等，請依原本語氣自然處理。
   可以適度保留「ㅋㅋ」「ㅎㅎ」，不要全部機械翻成「哈哈」。

8. 如果一句話明顯是在接續上一則訊息，請參考前後文讓中文讀起來連貫。

9. 不要增加原文沒有的資訊。

10. 不要刪除原文的重要語氣或意思。

11. 不要自行合併或拆分任何訊息。

12. 必須一個 `id` 對應一個翻譯。

13. 只回傳 JSON object。

14. 回傳格式必須完全如下：

{{
  "msg0001": "中文翻譯",
  "msg0002": "中文翻譯"
}}

15. 不要回傳 `date`、`time`、`sender`、`text` 等原始欄位。

16. 不要使用 Markdown code block。

17. 不要加 ```json。

18. 不要寫任何前言、說明、註解或結語。

19. 回傳內容必須是可以直接被 Python `json.loads()` 解析的合法 JSON。

【日期】
{date}

【當天訊息】
{json_text}
""".strip()


# ============================================================
# JSON 輸出格式
# ============================================================

def save_json(data, output_file):
    """
    每筆訊息維持單行。
    """

    dates = list(data.keys())

    temp_file = output_file.with_suffix(
        output_file.suffix + ".tmp"
    )

    with temp_file.open("w", encoding="utf-8") as f:

        f.write("{\n")

        for date_index, date in enumerate(dates):

            f.write(
                f'  {json.dumps(date, ensure_ascii=False)}: [\n'
            )

            messages = data[date]

            for msg_index, msg in enumerate(messages):

                line = json.dumps(
                    msg,
                    ensure_ascii=False,
                    separators=(",", ": ")
                )

                comma = (
                    ","
                    if msg_index < len(messages) - 1
                    else ""
                )

                f.write(
                    f"    {line}{comma}\n"
                )

            date_comma = (
                ","
                if date_index < len(dates) - 1
                else ""
            )

            f.write(
                f"  ]{date_comma}\n"
            )

        f.write("}\n")

    temp_file.replace(output_file)


# ============================================================
# 讀取資料
# ============================================================

def load_data():

    # 如果已有翻譯輸出檔，優先讀輸出檔
    # 這樣程式中斷後可以接著跑

    if OUTPUT_FILE.exists():

        print(
            f"讀取既有翻譯檔：{OUTPUT_FILE}"
        )

        with OUTPUT_FILE.open(
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    print(
        f"讀取原始檔：{INPUT_FILE}"
    )

    with INPUT_FILE.open(
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)


# ============================================================
# 判斷一天是否需要翻譯
# ============================================================

def needs_translation(messages):

    for msg in messages:

        text = str(
            msg.get("text", "") or ""
        ).strip()

        trans = str(
            msg.get("trans", "") or ""
        ).strip()

        if text and not trans:
            return True

    return False


# ============================================================
# 清理 API 回傳
# ============================================================

def clean_result(result):

    result = str(result).strip()

    # 有些模型偶爾還是會包 markdown
    if result.startswith("```json"):
        result = result[7:]

    elif result.startswith("```"):
        result = result[3:]

    if result.endswith("```"):
        result = result[:-3]

    return result.strip()


# ============================================================
# 翻譯一天
# ============================================================

def translate_day(date, messages):

    prompt = build_prompt(
        date,
        messages
    )

    result = ask_chatgpt(
        prompt,
        web_search=False,
        model_name=MODEL_NAME,
    )

    result = clean_result(result)

    try:

        translations = json.loads(result)

    except json.JSONDecodeError as e:

        print("\nAPI 回傳不是合法 JSON")
        print("--------------------------------")
        print(result)
        print("--------------------------------")

        raise RuntimeError(
            f"{date} JSON 解析失敗：{e}"
        )

    if not isinstance(
        translations,
        dict
    ):

        raise RuntimeError(
            f"{date} API 回傳不是 object"
        )

    return translations


# ============================================================
# 填回 trans
# ============================================================

def apply_translations(
    messages,
    translations
):

    id_map = {
        str(msg.get("id", "")): msg
        for msg in messages
    }

    count = 0

    for msg_id, trans in translations.items():

        msg_id = str(msg_id)

        if msg_id not in id_map:
            print(
                f"  [警告] 找不到 ID：{msg_id}"
            )
            continue

        msg = id_map[msg_id]

        # 原本沒有文字的媒體訊息不要填
        text = str(
            msg.get("text", "") or ""
        ).strip()

        if not text:
            continue

        msg["trans"] = str(
            trans or ""
        ).strip()

        count += 1

    return count


# ============================================================
# 檢查是否漏翻
# ============================================================

def check_missing(
    date,
    messages,
    translations
):

    expected_ids = {
        str(msg.get("id", ""))
        for msg in messages
        if str(
            msg.get("text", "") or ""
        ).strip()
        and not str(
            msg.get("trans", "") or ""
        ).strip()
    }

    returned_ids = set(
        map(str, translations.keys())
    )

    missing = (
        expected_ids - returned_ids
    )

    if missing:

        print(
            f"  [警告] API 少回 {len(missing)} 筆："
        )

        print(
            "  "
            + ", ".join(
                sorted(missing)
            )
        )

    return missing


# ============================================================
# 主程式
# ============================================================

def run():

    data = load_data()

    total_days = len(data)

    translated_days = 0
    skipped_days = 0
    failed_days = 0

    print("=" * 65)

    print(
        f"輸入檔：{INPUT_FILE}"
    )

    print(
        f"輸出檔：{OUTPUT_FILE}"
    )

    print(
        f"模型：{MODEL_NAME}"
    )

    print(
        f"共 {total_days} 天"
    )

    print("=" * 65)

    for index, (
        date,
        messages
    ) in enumerate(
        data.items(),
        start=1
    ):

        if not needs_translation(
            messages
        ):

            print(
                f"[{index}/{total_days}] "
                f"{date} 已完成，跳過"
            )

            skipped_days += 1
            continue

        text_count = sum(
            1
            for msg in messages
            if str(
                msg.get("text", "") or ""
            ).strip()
            and not str(
                msg.get("trans", "") or ""
            ).strip()
        )

        print(
            f"\n[{index}/{total_days}] "
            f"翻譯 {date}"
        )

        print(
            f"  待翻譯：{text_count} 則"
        )

        try:

            translations = translate_day(
                date,
                messages
            )

            missing = check_missing(
                date,
                messages,
                translations
            )

            count = apply_translations(
                messages,
                translations
            )

            print(
                f"  API 回傳："
                f"{len(translations)} 則"
            )

            print(
                f"  成功填入："
                f"{count} 則"
            )

            if missing:

                print(
                    f"  尚缺："
                    f"{len(missing)} 則"
                )

            # 每完成一天立即存檔
            save_json(
                data,
                OUTPUT_FILE
            )

            print(
                "  已存檔"
            )

            translated_days += 1

        except KeyboardInterrupt:

            print(
                "\n\n使用者中斷。"
            )

            print(
                "已完成的日期都已保存。"
            )

            save_json(
                data,
                OUTPUT_FILE
            )

            return

        except Exception as e:

            failed_days += 1

            print(
                f"  !! 翻譯失敗：{e}"
            )

            # 失敗也存一次，
            # 避免前面已完成資料遺失
            save_json(
                data,
                OUTPUT_FILE
            )

        time.sleep(
            SLEEP_SECONDS
        )

    # 最後再存一次
    save_json(
        data,
        OUTPUT_FILE
    )

    # 統計
    total_text = 0
    total_translated = 0
    total_missing = 0

    for messages in data.values():

        for msg in messages:

            text = str(
                msg.get("text", "") or ""
            ).strip()

            trans = str(
                msg.get("trans", "") or ""
            ).strip()

            if text:

                total_text += 1

                if trans:
                    total_translated += 1
                else:
                    total_missing += 1

    print("\n" + "=" * 65)

    print("完成")

    print(
        f"本次翻譯："
        f"{translated_days} 天"
    )

    print(
        f"跳過："
        f"{skipped_days} 天"
    )

    print(
        f"失敗："
        f"{failed_days} 天"
    )

    print(
        f"文字訊息總數："
        f"{total_text}"
    )

    print(
        f"已有翻譯："
        f"{total_translated}"
    )

    print(
        f"尚未翻譯："
        f"{total_missing}"
    )

    print(
        f"輸出檔："
        f"{OUTPUT_FILE.resolve()}"
    )

    print("=" * 65)


# ============================================================
# 執行
# ============================================================

if __name__ == "__main__":
    run()