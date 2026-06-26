#!/usr/bin/env python3
"""Inline styles.css into each HTML page's <head> to remove the render-blocking
stylesheet request (big FCP/LCP win under throttled mobile, where every request
pays a large latency penalty).

styles.css stays the single source of truth. Edit it, then run:

    python inline-css.py

First run replaces the <link rel="stylesheet" href="styles.css"> tag with a
marked <style> block; later runs just refresh the block between the markers.
"""
import re
import pathlib

ROOT = pathlib.Path(__file__).parent
PAGES = ["index.html", "resume.html"]
START = "<!-- styles:start (inlined from styles.css by inline-css.py — edit styles.css, then re-run) -->"
END = "<!-- styles:end -->"

css = (ROOT / "styles.css").read_text(encoding="utf-8", newline="")
block = f"{START}\n  <style>\n{css}\n  </style>\n  {END}"

# match an existing inlined block (re-run) or the original <link> tag (first run)
existing = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
link = re.compile(r'<link rel="stylesheet" href="styles\.css"\s*/?>')

for name in PAGES:
    path = ROOT / name
    html = path.read_text(encoding="utf-8", newline="")
    if existing.search(html):
        html = existing.sub(block, html, count=1)
    elif link.search(html):
        html = link.sub(block, html, count=1)
    else:
        print(f"!! {name}: no stylesheet link or marker found — skipped")
        continue
    path.write_text(html, encoding="utf-8", newline="")
    print(f"ok {name}")
