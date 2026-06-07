import subprocess
import time
import csv
import xml.etree.ElementTree as ET
from pathlib import Path

ADB_PATH = r"C:\platform-tools\adb.exe"

OUT_DIR = Path("fromm_dump")
OUT_DIR.mkdir(exist_ok=True)

CSV_FILE = OUT_DIR / "fromm_messages_raw.csv"


def run(cmd):
    subprocess.run(cmd, shell=True, check=True)


def dump_ui(index):
    phone_path = "/sdcard/window.xml"
    local_path = OUT_DIR / f"window_{index:04d}.xml"

    run(f'"{ADB_PATH}" shell uiautomator dump {phone_path}')
    run(f'"{ADB_PATH}" pull {phone_path} "{local_path}"')

    return local_path


def parse_texts(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    texts = []

    for node in root.iter("node"):
        text = node.attrib.get("text", "").strip()
        bounds = node.attrib.get("bounds", "")

        if text:
            texts.append({
                "text": text,
                "bounds": bounds,
            })

    return texts


def swipe_up():
    run(f'"{ADB_PATH}" shell input swipe 500 1600 500 500 900')


def main():
    seen = set()

    with open(CSV_FILE, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["page", "text", "bounds"])

        for i in range(5000):
            print(f"抓第 {i + 1} 頁...")

            xml_path = dump_ui(i)
            texts = parse_texts(xml_path)

            for item in texts:
                key = item["text"] + item["bounds"]
                if key not in seen:
                    seen.add(key)
                    writer.writerow([i + 1, item["text"], item["bounds"]])

            swipe_up()
            time.sleep(1.2)

    print(f"完成：{CSV_FILE}")


if __name__ == "__main__":
    main()