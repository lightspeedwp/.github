#!/usr/bin/env python3
"""Run conservative quality checks for a ChatGPT skill folder.

This script is intentionally local-only. It reads files in a skill directory,
checks common packaging and maintainability risks, compiles bundled Python
scripts, and reports errors/warnings. It does not modify files.
"""

from __future__ import annotations

import argparse
import ast
import re
from pathlib import Path

MAX_ZIP_BYTES = 25 * 1024 * 1024
MAX_SKILL_MD_LINES = 500
DANGEROUS_IMPORTS = {"requests", "urllib", "http", "socket", "subprocess"}
DANGEROUS_CALLS = {"eval", "exec", "system", "rmtree", "unlink"}
ACCIDENTAL_NAMES = {"__pycache__", ".DS_Store"}
ACCIDENTAL_SUFFIXES = {".pyc", ".pyo", ".tmp", ".log"}


def add(collection: list[str], message: str) -> None:
    collection.append(message)


def parse_frontmatter(text: str) -> tuple[dict[str, str], str | None]:
    if not text.startswith("---\n"):
        return {}, "SKILL.md must start with YAML frontmatter."
    end = text.find("\n---", 4)
    if end == -1:
        return {}, "SKILL.md frontmatter closing delimiter not found."
    raw = text[4:end].strip().splitlines()
    data: dict[str, str] = {}
    for line in raw:
        if not line.strip():
            continue
        if ":" not in line:
            return data, f"Invalid frontmatter line: {line}"
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip('"').strip("'")
    return data, None


def referenced_paths(skill_text: str) -> set[str]:
    refs = set(re.findall(r"`(references/[^`]+?|scripts/[^`]+?)`", skill_text))
    refs.update(re.findall(r"\((references/[^)]+?|scripts/[^)]+?)\)", skill_text))
    refs.update(re.findall(r"\b(references/[A-Za-z0-9_.\-/]+|scripts/[A-Za-z0-9_.\-/]+)", skill_text))
    return {ref.rstrip(".,;:") for ref in refs}


def check_python_script(path: Path, warnings: list[str], errors: list[str]) -> None:
    try:
        source = path.read_text(encoding="utf-8")
        tree = ast.parse(source, filename=str(path))
    except SyntaxError as exc:
        add(errors, f"Python syntax error in {path}: {exc}")
        return
    except UnicodeDecodeError as exc:
        add(errors, f"Cannot read Python script {path}: {exc}")
        return

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                root = alias.name.split(".", 1)[0]
                if root in DANGEROUS_IMPORTS:
                    add(warnings, f"Review import `{alias.name}` in {path}.")
        elif isinstance(node, ast.ImportFrom):
            root = (node.module or "").split(".", 1)[0]
            if root in DANGEROUS_IMPORTS:
                add(warnings, f"Review import `{node.module}` in {path}.")
        elif isinstance(node, ast.Call):
            func = node.func
            name = ""
            if isinstance(func, ast.Name):
                name = func.id
            elif isinstance(func, ast.Attribute):
                name = func.attr
            if name in DANGEROUS_CALLS:
                add(warnings, f"Review call `{name}` in {path}.")


def total_size(path: Path) -> int:
    return sum(item.stat().st_size for item in path.rglob("*") if item.is_file())


def run_checks(skill_dir: Path, strict: bool) -> int:
    errors: list[str] = []
    warnings: list[str] = []

    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        add(errors, "Missing SKILL.md.")
        skill_text = ""
    else:
        skill_text = skill_md.read_text(encoding="utf-8")
        frontmatter, fm_error = parse_frontmatter(skill_text)
        if fm_error:
            add(errors, fm_error)
        allowed = {"name", "description"}
        extra = set(frontmatter) - allowed
        missing = allowed - set(frontmatter)
        if missing:
            add(errors, f"Missing frontmatter field(s): {', '.join(sorted(missing))}.")
        if extra:
            add(errors, f"Unexpected frontmatter field(s): {', '.join(sorted(extra))}.")
        name = frontmatter.get("name", "")
        description = frontmatter.get("description", "")
        if name and not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
            add(errors, "Frontmatter name must be lowercase kebab-case.")
        if description and len(description.split()) < 20:
            add(warnings, "Description may be too short to trigger reliably.")
        if description and description != description.lower():
            add(warnings, "Description should be lowercase for this skill convention.")
        line_count = len(skill_text.splitlines())
        if line_count > MAX_SKILL_MD_LINES:
            add(warnings, f"SKILL.md has {line_count} lines; move detail into references.")
        if "TODO" in skill_text or "PLACEHOLDER" in skill_text:
            add(warnings, "SKILL.md contains TODO or PLACEHOLDER text.")

    if not (skill_dir / "agents" / "openai.yaml").exists():
        add(errors, "Missing agents/openai.yaml.")

    refs_dir = skill_dir / "references"
    if refs_dir.exists() and skill_text:
        linked = referenced_paths(skill_text)
        for ref_file in sorted(refs_dir.glob("*.md")):
            rel = ref_file.relative_to(skill_dir).as_posix()
            if rel not in linked:
                add(warnings, f"Reference not linked from SKILL.md: {rel}")
    elif not refs_dir.exists():
        add(warnings, "No references directory found.")

    scripts_dir = skill_dir / "scripts"
    if scripts_dir.exists():
        linked = referenced_paths(skill_text) if skill_text else set()
        for script in sorted(scripts_dir.glob("*.py")):
            rel = script.relative_to(skill_dir).as_posix()
            if rel not in linked:
                add(warnings, f"Script not mentioned in SKILL.md: {rel}")
            check_python_script(script, warnings, errors)

    for item in skill_dir.rglob("*"):
        if item.name in ACCIDENTAL_NAMES or item.suffix in ACCIDENTAL_SUFFIXES:
            add(errors, f"Accidental file should not be packaged: {item.relative_to(skill_dir)}")

    size = total_size(skill_dir)
    if size > MAX_ZIP_BYTES:
        add(errors, f"Skill folder is over 25 MB: {size} bytes.")

    print("Skill quality check")
    print(f"skill_dir: {skill_dir}")
    print(f"size_bytes: {size}")
    print(f"errors: {len(errors)}")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"warnings: {len(warnings)}")
    for warning in warnings:
        print(f"WARNING: {warning}")

    if errors or (strict and warnings):
        return 1
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Run local quality checks for a ChatGPT skill folder.")
    parser.add_argument("--skill-dir", default=".", help="Path to the skill directory.")
    parser.add_argument("--strict", action="store_true", help="Treat warnings as failures.")
    args = parser.parse_args()

    skill_dir = Path(args.skill_dir).resolve()
    if not skill_dir.exists() or not skill_dir.is_dir():
        raise SystemExit(f"skill directory not found: {skill_dir}")
    return run_checks(skill_dir, args.strict)


if __name__ == "__main__":
    raise SystemExit(main())
