import os

path = r'c:\Users\goh30\OneDrive\클로드 앱 개발\ShortSqueeze-AI\dashboard\src\app\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    broken_text = f.read()

# Encode back to iso-8859-1 to get the original bytes
original_bytes = broken_text.encode('iso-8859-1')

# Now try decoding as utf-8 but ignore/replace bad bytes
try:
    recovered_text = original_bytes.decode('utf-8', errors='replace')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(recovered_text)
    print("Recovered with UTF-8 (replace errors)")
except Exception as e:
    print(f"Final recovery attempt failed: {e}")
