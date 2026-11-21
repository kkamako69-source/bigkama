#!/usr/bin/env python3
"""Lightweight, dependency-free smoke checks for static HTML repositories."""
from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {".git", ".github", "node_modules", "vendor", ".venv"}

class PageAudit(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.html_lang = ""
        self.title_text = ""
        self.in_title = False
        self.ids: list[str] = []
        self.images_without_alt = 0
        self.local_refs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "html":
            self.html_lang = data.get("lang") or ""
        if "id" in data and data["id"]:
            self.ids.append(data["id"])
        if tag == "img" and "alt" not in data:
            self.images_without_alt += 1
        for key in ("src", "href"):
            value = data.get(key)
            if not value:
                continue
            parsed = urlsplit(value.strip())
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            if value.strip().startswith("#"):
                continue
            self.local_refs.append(unquote(parsed.path))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_text += data

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)

def iter_html() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        files.append(path)
    return sorted(files)

def main() -> int:
    files = iter_html()
    full_docs = 0
    errors: list[str] = []
    warnings: list[str] = []
    for path in files:
        try:
            raw = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            warnings.append(f"{path.relative_to(ROOT)}: fichier non UTF-8, ignoré")
            continue
        if "<!doctype html" not in raw[:2048].lower():
            warnings.append(f"{path.relative_to(ROOT)}: fragment HTML (contrôle documentaire ignoré)")
            continue
        full_docs += 1
        parser = PageAudit()
        try:
            parser.feed(raw)
            parser.close()
        except Exception as exc:  # Report parser issues without hiding other pages.
            errors.append(f"{path.relative_to(ROOT)}: parsing impossible: {exc}")
            continue
        relative = path.relative_to(ROOT)
        if not parser.html_lang:
            errors.append(f"{relative}: attribut lang manquant sur <html>")
        if not parser.title_text.strip():
            errors.append(f"{relative}: titre <title> manquant ou vide")
        duplicates = [item for item, count in Counter(parser.ids).items() if count > 1]
        if duplicates:
            errors.append(f"{relative}: identifiants HTML dupliqués: {', '.join(duplicates)}")
        if parser.images_without_alt:
            warnings.append(f"{relative}: {parser.images_without_alt} image(s) sans attribut alt")
        for ref in parser.local_refs:
            if ref.startswith("/"):
                target = ROOT / ref.lstrip("/")
            else:
                target = path.parent / ref
            # URL fragments and directory links are not checked here.
            if not target.exists():
                warnings.append(f"{relative}: ressource locale introuvable: {ref}")
    print(f"Contrôle HTML : {full_docs} document(s) complet(s), {len(files)} fichier(s) HTML analysé(s).")
    for warning in warnings:
        print(f"AVERTISSEMENT: {warning}")
    for error in errors:
        print(f"ERREUR: {error}")
    if errors:
        return 1
    print("OK : structure minimale vérifiée. Les avertissements doivent être examinés manuellement.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
