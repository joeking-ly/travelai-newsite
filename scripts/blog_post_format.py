"""Shared blog article HTML normalization and share block."""

from __future__ import annotations

import re

from bs4 import Tag

SITE_CSS_VERSION = "41"

SHARE_SECTION_HTML = """  <section class="share">
    <div class="share-inner">
      <h3 class="share-title">Enjoyed this post? Share it</h3>
      <div class="share-buttons">
        <button class="share-btn" type="button" data-share="x" aria-label="Share on X">
          <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          <span>Share on X</span>
        </button>
        <button class="share-btn" type="button" data-share="linkedin" aria-label="Share on LinkedIn">
          <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          <span>Share on LinkedIn</span>
        </button>
        <button class="share-btn" type="button" data-share="email" aria-label="Share by email">
          <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span>Email</span>
        </button>
        <button class="share-btn" type="button" data-share="copy" aria-label="Copy link">
          <svg class="share-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  </section>"""


def _parse_int(value: str | None) -> int:
    if not value:
        return 0
    try:
        return int(re.sub(r"[^\d]", "", str(value)) or "0")
    except ValueError:
        return 0


def _is_empty_embed(el: Tag) -> bool:
    if el.find("iframe") or el.find("img"):
        return False
    return not el.get_text(" ", strip=True)


def _embed_like(tag: Tag) -> bool:
    if not isinstance(tag, Tag) or not tag.attrs:
        return False
    raw = tag.attrs.get("class")
    if not raw:
        classes = ""
    elif isinstance(raw, list):
        classes = " ".join(str(c) for c in raw).lower()
    else:
        classes = str(raw).lower()
    return any(token in classes for token in ("embed", "embedpress", "ose-youtube", "youtube"))


def _image_container(img: Tag) -> Tag:
    wp_block = None
    figure = None
    for parent in img.parents:
        if not isinstance(parent, Tag):
            continue
        classes = " ".join(parent.get("class") or [])
        if "wp-block-image" in classes:
            wp_block = parent
            break
        if parent.name == "figure" and figure is None:
            figure = parent
    if wp_block is not None:
        return wp_block
    if figure is not None:
        return figure
    return img.parent if isinstance(img.parent, Tag) else img


def normalize_article_content(content: Tag) -> Tag:
    content.name = "div"
    content["class"] = ["article-prose"]

    for el in list(content.find_all(["figure", "div"])):
        if _embed_like(el) and _is_empty_embed(el):
            el.decompose()

    for wrapper in list(
        content.select(".gutenberg-block-wraper, .ep-embed-content-wraper, .position-right-wraper")
    ):
        if _is_empty_embed(wrapper):
            wrapper.decompose()

    for tag in content.find_all(["script", "style", "form", "button"]):
        tag.decompose()

    for p in list(content.find_all("p")):
        text = p.get_text(strip=True)
        if not text or text.upper() == "END":
            p.decompose()

    for iframe in list(content.find_all("iframe")):
        figure = iframe.find_parent("figure")
        if figure is None:
            figure = content.new_tag("figure")
            iframe.insert_before(figure)
            figure.append(iframe.extract())
        figure["class"] = ["article-figure", "article-figure--video"]
        iframe.attrs.pop("width", None)
        iframe.attrs.pop("height", None)

    processed: set[int] = set()
    img_idx = 0
    for img in list(content.find_all("img")):
        block = _image_container(img)
        block_key = id(block)
        if block_key in processed:
            continue
        processed.add(block_key)

        for nested in list(block.find_all("figure")):
            if nested is not block:
                nested.unwrap()

        width = _parse_int(img.get("width"))
        height = _parse_int(img.get("height"))
        for attr in ("style", "width", "height", "class", "fetchpriority", "decoding"):
            img.attrs.pop(attr, None)

        block.name = "figure"
        block.attrs.pop("class", None)
        if width and height and width > height * 1.15:
            block["class"] = ["article-figure", "article-figure--wide"]
        else:
            img_idx += 1
            side = "article-figure--left" if img_idx % 2 == 1 else "article-figure--right"
            block["class"] = ["article-figure", side]

    for heading in content.find_all(["h2", "h3", "h4"]):
        heading["class"] = [c for c in (heading.get("class") or []) if not str(c).startswith("wp-block")]

    for ul in content.find_all("ul"):
        ul["class"] = [c for c in (ul.get("class") or []) if c != "wp-block-list"]

    for _ in range(4):
        flattened = False
        for fig in list(content.find_all("figure")):
            child_figures = fig.find_all("figure", recursive=False)
            if len(child_figures) != 1:
                continue
            child = child_figures[0]
            if child.find("figure"):
                continue
            if not child.find("img"):
                continue
            child.extract()
            fig.replace_with(child)
            flattened = True
        if not flattened:
            break

    return content
