#!/usr/bin/env python3
"""Convert Markdown to PDF using Pandoc.

Pandoc gives you a very productive "doc-like" pipeline with citations, math, and templates.

Examples:
  python md_to_pdf.py report.md --output report.pdf
  python md_to_pdf.py report.md -o report.pdf --pdf_engine xelatex
  python md_to_pdf.py report.md -o report.pdf --template template.tex

Tips:
- Use `--resource_path` so relative image paths resolve.
- For LaTeX-heavy docs, consider writing LaTeX directly (see latex_to_pdf.py).
"""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path
import shutil


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("input_md")
    p.add_argument("--output", "-o", required=True, help="Output PDF path")
    p.add_argument("--pdf_engine", default="xelatex")
    p.add_argument("--template")
    p.add_argument("--resource_path")
    p.add_argument("--extra", action="append", default=[], help="Extra pandoc args (repeatable)")
    args = p.parse_args()

    if shutil.which("pandoc") is None:
        raise SystemExit(
            "pandoc not found. Install pandoc or use an alternative pipeline (e.g. ReportLab or HTML->PDF)."
        )

    inp = Path(args.input_md)
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)

    resource_path = args.resource_path or str(inp.parent)

    cmd = [
        "pandoc",
        str(inp),
        "-o",
        str(out),
        "--pdf-engine",
        args.pdf_engine,
        "--resource-path",
        resource_path,
    ]
    if args.template:
        cmd += ["--template", args.template]
    cmd += args.extra

    print(" ".join(cmd))
    subprocess.run(cmd, check=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
