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
        
    print(text)
    return text


CURRENCY_REGEX = r"(?:₹|Rs\.?)\s*([\d]+(?:\.\d{1,2})?)"

def extract_items(text):
    items = []

    lines = text.splitlines()

    # Words/lines that should NOT become expenses
    ignore_keywords = [
        "total",
        "grand total",
        "subtotal",
        "sub total",
        "tax",
        "cgst",
        "sgst",
        "igst",
        "round off",
        "thank you",
        "qty",
        "item qty",
        "price amount",
    ]

    receipt_date = datetime.today().strftime("%Y-%m-%d")
    vendor = "Other"

    for line in lines:
        line = line.strip()

        if not line:
            continue

        lower_line = line.lower()

        # -----------------------------
        # Find date
        # -----------------------------
        date_match = re.search(
    r"\b(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})\b",
    line
)

        if date_match:
            day, month, year = date_match.groups()

            if len(year) == 2:
                year = "20" + year

            try:
                receipt_date = datetime.strptime(
            f"{day}-{month}-{year}",
            "%d-%m-%Y"
        ).strftime("%Y-%m-%d")
            except ValueError:
                pass

            continue

        # -----------------------------
        # Detect vendor
        # -----------------------------
        
        vendor = "Other"

        # -----------------------------
        # Ignore unnecessary lines
        # -----------------------------
        if any(keyword in lower_line for keyword in ignore_keywords):
            continue

        # -----------------------------
        # Find numbers
        # -----------------------------
        numbers = re.findall(
            r"\d+(?:\.\d{1,2})?",
            line
        )

        if not numbers:
            continue

        # We need at least an amount
        # Item lines generally contain:
        # item | qty | price | amount
        if len(numbers) < 2:
            continue

        # Last number = amount
        try:
            amount = float(numbers[-1])
        except ValueError:
            continue

        if amount <= 0:
            continue

        # -----------------------------
        # Remove numbers from title
        # -----------------------------
        title = re.sub(
            r"\d+(?:\.\d{1,2})?",
            "",
            line
        )

        title = re.sub(
            r"\s+",
            " ",
            title
        ).strip()

        # Remove random OCR symbols
        title = re.sub(
            r"[^A-Za-z0-9 &'-]",
            "",
            title
        ).strip()

        if not title:
            continue

        # Avoid obvious non-item lines
        if len(title) < 2:
            continue

        items.append({
            "title": title.title(),
            "amount": amount,
            "date": receipt_date,
            "vendor": vendor,
        })

    return items