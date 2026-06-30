#!/usr/bin/env python3
"""Export main page copy as markdown for content rewriting (e.g. Claude upload)."""

from __future__ import annotations

import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content-export"

MAIN_PAGES: list[tuple[str, str]] = [
    ("index.html", "homepage"),
    ("our-vision.html", "our-vision"),
    ("platform.html", "platform"),
    ("network.html", "network"),
    ("partners.html", "partners"),
    ("case-studies.html", "case-studies"),
    ("resources.html", "resources"),
    ("about.html", "about"),
    ("insights.html", "insights"),
    ("stories.html", "stories"),
    ("contact.html", "contact"),
    ("careers.html", "careers"),
    ("privacy.html", "privacy"),
    ("terms.html", "terms"),
]

SKIP_TAGS = frozenset({"script", "style", "noscript", "svg", "canvas", "iframe"})
BLOCK_TAGS = frozenset({"h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "dt", "dd", "blockquote"})
HEADING_LEVEL = {"h1": 1, "h2": 2, "h3": 3, "h4": 4, "h5": 5, "h6": 6}
CTA_CLASSES = re.compile(
    r"hero-cta|btn-primary|btn-white|btn-outline|nav-cta|unav-cta|scale-card|market-",
    re.I,
)


def preprocess_html(html: str) -> str:
    html = re.sub(r"<br\s*/?>", " ", html, flags=re.I)
    html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.I | re.S)
    html = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.I | re.S)
    html = re.sub(r"<svg[^>]*>.*?</svg>", "", html, flags=re.I | re.S)
    html = re.sub(r"<noscript[^>]*>.*?</noscript>", "", html, flags=re.I | re.S)
    html = re.sub(r"<div[^>]*id=[\"']universal-nav-placeholder[\"'][^>]*>.*?</div>", "", html, flags=re.I | re.S)
    html = re.sub(r"<div[^>]*id=[\"']universal-nav-placeholder[\"'][^>]*/>", "", html, flags=re.I)

    main = re.search(r"<main[^>]*>(.*)</main>", html, re.I | re.S)
    if main:
        html = main.group(1)
    else:
        body = re.search(r"<body[^>]*>(.*)</body>", html, re.I | re.S)
        if body:
            chunk = body.group(1)
            footer = re.search(r"<footer", chunk, re.I)
            if footer:
                chunk = chunk[: footer.start()]
            html = chunk

    return html


class ContentExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.lines: list[str] = []
        self._skip = 0
        self._tag_stack: list[str] = []
        self._title = ""
        self._in_title = False
        self._meta_desc = ""
        self._buffer = ""
        self._current_heading: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        attrs_dict = {k: (v or "") for k, v in attrs}
        cls = attrs_dict.get("class", "")

        if tag == "title":
            self._in_title = True
            return

        if tag == "meta" and attrs_dict.get("name", "").lower() == "description":
            self._meta_desc = attrs_dict.get("content", "").strip()
            return

        if tag in SKIP_TAGS:
            self._skip += 1
            return

        self._tag_stack.append(tag)

        if tag in HEADING_LEVEL:
            self._flush()
            self._current_heading = "#" * HEADING_LEVEL[tag]
        elif tag == "li":
            self._flush()
            self.lines.append("- ")
        elif tag in ("p", "blockquote", "dt", "dd") and not self._buffer:
            pass
        elif tag == "a" and CTA_CLASSES.search(cls):
            self._flush()
            self.lines.append("\n[CTA] ")

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()

        if self._in_title and tag == "title":
            self._in_title = False
            return

        if tag in SKIP_TAGS:
            self._skip = max(0, self._skip - 1)
            return

        if self._skip:
            if self._tag_stack and self._tag_stack[-1] == tag:
                self._tag_stack.pop()
            return

        if tag in HEADING_LEVEL:
            text = self._buffer.strip()
            self._buffer = ""
            if text:
                self.lines.append(f"\n{self._current_heading} {text}\n")
            self._current_heading = None
        elif tag in BLOCK_TAGS:
            self._flush(newline=True)
        elif tag == "a":
            self._flush()

        if self._tag_stack and self._tag_stack[-1] == tag:
            self._tag_stack.pop()

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._title += data
            return
        if self._skip:
            return
        text = re.sub(r"\s+", " ", data)
        if text.strip():
            self._buffer += text

    def _flush(self, newline: bool = False) -> None:
        text = self._buffer.strip()
        self._buffer = ""
        if not text:
            return
        if self.lines and self.lines[-1].startswith("- ") and not self.lines[-1].strip().endswith("-"):
            self.lines[-1] += text
        elif self.lines and self.lines[-1].startswith("[CTA]"):
            self.lines[-1] += text
        else:
            self.lines.append(text)
        if newline:
            self.lines.append("")

    def get_text(self) -> str:
        self._flush()
        raw = "\n".join(self.lines)
        raw = re.sub(r"\n{3,}", "\n\n", raw)
        raw = re.sub(r"^#+\s*$\n", "", raw, flags=re.M)
        raw = re.sub(r"^-\s*$\n", "", raw, flags=re.M)
        return raw.strip()


def extract_page(path: Path) -> tuple[str, str, str]:
    html = path.read_text(encoding="utf-8", errors="replace")
    title_match = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    title = re.sub(r"\s+", " ", title_match.group(1)).strip() if title_match else ""
    meta_match = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]*content=["\']([^"\']*)["\']',
        html,
        re.I,
    ) or re.search(
        r'<meta[^>]+content=["\']([^"\']*)["\'][^>]*name=["\']description["\']',
        html,
        re.I,
    )
    meta = meta_match.group(1).strip() if meta_match else ""

    cleaned = preprocess_html(html)
    parser = ContentExtractor()
    parser._title = title
    parser._meta_desc = meta
    parser.feed(cleaned)
    return title, meta, parser.get_text()


def write_brief() -> None:
    design = (ROOT / "DESIGN.md").read_text(encoding="utf-8", errors="replace")
    brand = "\n".join(design.splitlines()[:54])

    brief = f"""# TravelAI — Content rewrite brief

Use this package when rewriting marketing copy for the TravelAI website.

## Your task

Rewrite the copy in each page file for clarity, persuasion, and brand voice. Keep:
- Section structure and intent (headings map to page sections)
- Factual claims (stats, product names, 530+ brands, Traveler.md, GMP, etc.) unless you flag something as outdated
- SEO meta title and description as separate deliverables at the top of each page file

Return rewritten copy in the same markdown structure (headings, bullets). Mark CTAs with `[CTA]` prefix.

## Brand reference (from DESIGN.md)

{brand}

## Files in this package

| File | Page |
|------|------|
"""
    for _, slug in MAIN_PAGES:
        brief += f"| `{slug}.md` | {slug.replace('-', ' ').title()} |\n"

    brief += """
## Global voice reminders

- **Category:** The Travel Memory Company
- **Tone:** Confident, infrastructure-minded, human-first — builders who ship at scale
- **Avoid:** Generic AI hype, lock-in language, fear-mongering, travel clichés (passports, suitcases as decoration)

## Stats to preserve (verify before changing)

- 530+ travel brands (network)
- 50M+ travelers helped yearly
- $630M+ gross booking value
- 2500+ travel bookings daily
"""
    (OUT / "00-BRIEF-FOR-CLAUDE.md").write_text(brief, encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    write_brief()

    combined: list[str] = [
        "# TravelAI — All main pages (combined export)\n\n",
        "See `00-BRIEF-FOR-CLAUDE.md` for brand voice and instructions.\n\n---\n",
    ]

    for html_name, slug in MAIN_PAGES:
        path = ROOT / html_name
        if not path.exists():
            print(f"skip missing: {html_name}")
            continue
        title, meta, body = extract_page(path)
        md = f"""# {title or slug.replace('-', ' ').title()}

**Source file:** `{html_name}`  
**URL path:** `/{'' if html_name == 'index.html' else html_name}`

## Meta (for SEO)

- **Title:** {title}
- **Description:** {meta}

---

## Page content

{body}
"""
        out_path = OUT / f"{slug}.md"
        out_path.write_text(md, encoding="utf-8")
        combined.append(f"\n\n---\n\n# PAGE: {slug.upper()} (`{html_name}`)\n\n")
        combined.append(f"**Title:** {title}\n\n{body}\n")
        print(f"wrote {out_path.name} ({len(body):,} chars)")

    (OUT / "ALL-MAIN-PAGES.md").write_text("".join(combined), encoding="utf-8")

    # Zip for easy upload
    import zipfile

    zip_path = ROOT / "content-export.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in sorted(OUT.glob("*.md")):
            zf.write(f, f"content-export/{f.name}")

    print(f"\nDone → {OUT.relative_to(ROOT)}/")
    print(f"Zip   → {zip_path.name}")
    print("Upload the zip or individual .md files to Claude.")


if __name__ == "__main__":
    main()
