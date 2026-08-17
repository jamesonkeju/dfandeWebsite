import urllib.request
import os
import re
import time

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
DEST_ROOT = r"c:\Users\Kay Freeman\Documents\Jameson\DFANDE\Images"
LIST_FILE = r"c:\Users\Kay Freeman\Documents\Jameson\DFANDE\Documents\_live-site-scrape-reference\all_site_images.txt"

with open(LIST_FILE, "r", encoding="utf-8") as f:
    urls = [line.strip() for line in f if line.strip()]

req_headers = {"User-Agent": UA, "Referer": "https://dfande.com/"}

ok, fail = 0, 0
fails = []
for url in urls:
    # Preserve the wp-content/uploads/YYYY/MM/ structure as a subfolder to avoid filename collisions.
    m = re.search(r"/uploads/(\d{4})/(\d{2})/([^/]+)$", url)
    if not m:
        continue
    year, month, fname = m.groups()
    dest_dir = os.path.join(DEST_ROOT, f"{year}-{month}")
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, fname)
    try:
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req, timeout=20) as resp, open(dest, "wb") as out:
            out.write(resp.read())
        ok += 1
    except Exception as e:
        fail += 1
        fails.append((url, str(e)))
    time.sleep(0.05)

print(f"Done. ok={ok} fail={fail}")
for url, err in fails:
    print("FAIL", url, "->", err)
