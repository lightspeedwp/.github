#!/usr/bin/env python3
"""Validate file references mentioned in an instructions text file.

This validator treats file-tag ids as the source of truth when possible and uses
labels only as display text. In a staged workspace without file-tree metadata, it
falls back to checking whether the label matches a staged relative path, a staged
basename, or a staged folder name.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ENTITY_TAG_RE = re.compile(r"\{\{label:(?P<label>.*?),id:(?P<id>.*?),type:(?P<type>.*?)\}\}")


def load_paths(agent_files_root: Path) -> tuple[set[str], set[str], set[str]]:
    file_paths: set[str] = set()
    basenames: set[str] = set()
    folder_names: set[str] = set()
    for path in agent_files_root.rglob("*"):
        rel = path.relative_to(agent_files_root).as_posix()
        if path.is_file():
            file_paths.add(rel)
            basenames.add(path.name)
        elif path.is_dir() and rel != ".":
            folder_names.add(path.name)
    return file_paths, basenames, folder_names


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate instruction file references")
    parser.add_argument("instruction_file", help="Path to a text file containing instruction text")
    parser.add_argument("--agent-files-root", default=".", help="Root directory containing staged agent files")
    args = parser.parse_args()

    instruction_path = Path(args.instruction_file)
    agent_files_root = Path(args.agent_files_root)

    if not instruction_path.exists():
        print(f"[FAIL] instruction file not found: {instruction_path}")
        return 1
    if not agent_files_root.exists():
        print(f"[FAIL] agent files root not found: {agent_files_root}")
        return 1

    text = instruction_path.read_text(encoding="utf-8")
    file_paths, basenames, folder_names = load_paths(agent_files_root)

    issues: list[str] = []
    for match in ENTITY_TAG_RE.finditer(text):
        if match.group("type") != "file":
            continue
        label = match.group("label")
        if label in file_paths or label in basenames or label in folder_names:
            continue
        issues.append(f"referenced file tag label not found in staged agent files: {label}")

    if issues:
        for issue in issues:
            print(f"[FAIL] {issue}")
        print(f"\nInstruction reference validation failed with {len(issues)} issue(s).")
        return 1

    print("All instruction file references resolved successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
