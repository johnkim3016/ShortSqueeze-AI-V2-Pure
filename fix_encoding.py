import os

path = r'c:\Users\goh30\OneDrive\클로드 앱 개발\ShortSqueeze-AI\dashboard\src\app\page.tsx'

# Try different encodings to read the file
encodings = ['utf-8', 'euc-kr', 'cp949', 'iso-8859-1']
content = None

for enc in encodings:
    try:
        with open(path, 'rb') as f:
            raw = f.read()
            content = raw.decode(enc)
            print(f"Successfully decoded with {enc}")
            break
    except Exception as e:
        print(f"Failed decoding with {enc}: {e}")

if content:
    # Save as clean UTF-8
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Saved as clean UTF-8")
else:
    print("Could not decode file with any checked encoding")
