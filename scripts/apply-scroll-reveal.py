#!/usr/bin/env python3
"""Inject motion-reveal.css and scroll-reveal.js into all production HTML pages."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {"Claude Design", "node_modules", ".git"}

MOTION_CSS = '<link rel="stylesheet" href="{root}css/motion-reveal.css?v=2">'
SCROLL_JS = '<script src="{root}js/scroll-reveal.js?v=2"></script>'
MOTION_JS = '<script type="module" src="{root}js/motion-reveal.js"></script>'

GRID_MARKERS = (
    "agentic-section",
    "partners-section",
    "mission-grid",
    "values-grid",
    "press-grid",
    "docs-grid",
    "labs-grid",
    "tech-grid",
    "factors-grid",
    "surfaces-grid",
    "products-grid",
    "types-grid",
    "testimonial-card",
)


def asset_root(path: Path) -> str:
    rel = path.relative_to(ROOT)
    depth = len(rel.parts) - 1
    return "../" * depth if depth else ""


def needs_motion_js(text: str) -> bool:
    return any(marker in text for marker in GRID_MARKERS)


def inject_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    root = asset_root(path)

    if "motion-reveal.css" not in text:
        nav_css = f'href="{root}css/universal-nav.css'
        if nav_css in text:
            text = text.replace(
                f'href="{root}css/universal-nav.css',
                f'href="{root}css/universal-nav.css',
                1,
            )
            text = re.sub(
                rf'(<link rel="stylesheet" href="{re.escape(root)}css/universal-nav\.css[^"]*">)',
                r"\1\n  " + MOTION_CSS.format(root=root),
                text,
                count=1,
            )
        else:
            site_css = f'href="{root}css/site.css'
            if site_css in text:
                text = text.replace(
                    f'<link rel="stylesheet" href="{root}css/site.css',
                    MOTION_CSS.format(root=root) + f'\n  <link rel="stylesheet" href="{root}css/site.css',
                    1,
                )

    if "scroll-reveal.js" not in text:
        nav_js = f'src="{root}js/universal-nav.js'
        if nav_js in text:
            text = re.sub(
                rf'(<script src="{re.escape(root)}js/universal-nav\.js[^"]*"></script>)',
                r"\1\n  " + SCROLL_JS.format(root=root),
                text,
                count=1,
            )
        else:
            text = text.replace("</body>", f"  {SCROLL_JS.format(root=root)}\n</body>", 1)

    if needs_motion_js(text) and "motion-reveal.js" not in text:
        if "scroll-reveal.js" in text:
            text = text.replace(
                SCROLL_JS.format(root=root),
                SCROLL_JS.format(root=root) + "\n  " + MOTION_JS.format(root=root),
                1,
            )
        else:
            text = text.replace("</body>", f"  {MOTION_JS.format(root=root)}\n</body>", 1)

    # Normalize scroll-reveal version
    text = re.sub(r'scroll-reveal\.js\?v=\d+', "scroll-reveal.js?v=2", text)
    text = re.sub(
        r'href="([^"]*)css/motion-reveal\.css(?:\?v=\d+)?"',
        lambda m: f'href="{m.group(1)}css/motion-reveal.css?v=2"',
        text,
    )

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    updated = 0
    for path in sorted(ROOT.rglob("*.html")):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if inject_file(path):
            updated += 1
            print(path.relative_to(ROOT))
    print(f"\nUpdated {updated} files.")


if __name__ == "__main__":
    main()
