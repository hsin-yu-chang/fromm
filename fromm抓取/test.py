import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
messages_path = BASE_DIR.parent / "messages" / "messages.json"

with open(messages_path, "r", encoding="utf-8") as f:
    data = json.load(f)

seen_text = set()   # 記錄已經出現過的 text
a = []              # 存不重複的 url
count = 0

for date, msgs in data.items():
    for msg in msgs:
        if msg.get("type") == "emoticon":
            text = msg.get("text", "")

            # 如果這個 text 已經出現過，就跳過
            if text in seen_text:
                continue

            seen_text.add(text)

            url = msg.get("url", "")
            a.append(url)

            count += 1
            print(count, date, msg.get("id"), text, url)

print("emoticon 不重複 text 總數：", count)
print(a)