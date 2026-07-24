import json

input_path = r"../messages/sw_fromm.json"
output_path = r"fromm_messages_fixed.json"

with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

fixed = 0
for date_key, messages in data.items():
    for msg in messages:
        if msg.get("date") != date_key:
            msg["date"] = date_key
            fixed += 1

with open(output_path, "w", encoding="utf-8") as f:
    f.write("{\n")
    date_keys = list(data.keys())
    for i, date_key in enumerate(date_keys):
        messages = data[date_key]
        f.write(f'  {json.dumps(date_key, ensure_ascii=False)}: [\n')
        for j, msg in enumerate(messages):
            line = json.dumps(msg, ensure_ascii=False)
            comma = "," if j < len(messages) - 1 else ""
            f.write(f'    {line}{comma}\n')
        closing = "  ]," if i < len(date_keys) - 1 else "  ]"
        f.write(f'{closing}\n')
    f.write("}\n")

print(f"完成！共修正 {fixed} 筆物件的 date 欄位。")
print(f"輸出檔案：{output_path}")