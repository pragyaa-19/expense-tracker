from pdf2image import convert_from_path
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
import os
import re
from datetime import datetime

OCR_CONFIG = r'--oem 3 --psm 6'

def extract_text_from_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    text = ""

    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
    elif ext == ".pdf":
        images = convert_from_path(file_path, dpi=300)  # increase dpi for better OCR
        for img in images:
            img = img.convert('L')
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(2)
            img = img.filter(ImageFilter.SHARPEN)
            text += pytesseract.image_to_string(img, config=OCR_CONFIG) + "\n"
    else:
        img = Image.open(file_path)
        img = img.convert('L')
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2)
        img = img.filter(ImageFilter.SHARPEN)
        text = pytesseract.image_to_string(img, config=OCR_CONFIG)

    return text

import re
from datetime import datetime

import re
from datetime import datetime

CURRENCY_REGEX = r"(?:₹|Rs\.?)?\s*([\d]+(?:\.\d{1,2})?)"

def extract_items(text):
    items = []
    lines = text.splitlines()

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Extract date if present
        date_match = re.search(r"(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})", line)
        if date_match:
            raw_date = date_match.group(1).replace("/", "-")
            for fmt in ("%d-%m-%Y", "%d-%m-%y"):
                try:
                    date = datetime.strptime(raw_date, fmt).strftime("%Y-%m-%d")
                    break
                except ValueError:
                    continue
            else:
                date = datetime.today().strftime("%Y-%m-%d")
        else:
            date = datetime.today().strftime("%Y-%m-%d")

        # Try to extract amount with currency symbol first
        amount_match = re.search(r"(?:₹|Rs\.?)\s*([\d]+(?:\.\d{1,2})?)", line)
        if amount_match:
            amount = float(amount_match.group(1))
        else:
            # Fallback: pick first number in the line
            numbers = re.findall(r"[\d]+(?:\.\d{1,2})?", line)
            amount = float(numbers[0]) if numbers else 0.0

        # Remove numbers and date to get title
        title_part = re.sub(r"[\d]+(?:\.\d{1,2})?", "", line)
        title_part = re.sub(r"\d{1,2}[-/]\d{1,2}[-/]\d{2,4}", "", title_part)
        title = title_part.strip().title() or "Unknown Item"

        items.append({
            "title": title,
            "amount": amount,
            "date": date,
            "vendor": "Other"
        })

    return items
