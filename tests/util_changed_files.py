import os
import subprocess
from typing import List, Iterable

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def _run_git(*args) -> str:
    try:
        out = subprocess.check_output(["git", *args], cwd=REPO_ROOT, stderr=subprocess.STDOUT)
        return out.decode("utf-8", errors="replace")
    except Exception:
        return ""

def list_changed_paths_vs_main() -> List[str]:
    """
    Return a list of paths changed vs main..HEAD.
    Falls back to scanning docs/ and .github/ if git info is not available.
    """
    # Allow override via env var (e.g., CI can set CHANGED_FILES as newline-separated list)
    env_files = os.environ.get("CHANGED_FILES")
    if env_files:
        return [p.strip() for p in env_files.splitlines() if p.strip()]

    diff = _run_git("diff", "main..HEAD", "--name-only")
    paths = [p.strip() for p in diff.splitlines() if p.strip()]
    if paths:
        return paths

    # Fallback: scan docs and PR templates
    fallback = []
    for base in ("docs", ".github"):
        base_dir = os.path.join(REPO_ROOT, base)
        if os.path.isdir(base_dir):
            for root, _dirs, files in os.walk(base_dir):
                for f in files:
                    fallback.append(os.path.relpath(os.path.join(root, f), REPO_ROOT))
    return fallback

def filter_markdown(paths: Iterable[str]) -> List[str]:
    return [p for p in paths if p.endswith(".md")]

def filter_changed_markdown() -> List[str]:
    return filter_markdown(list_changed_paths_vs_main())

def filter_pr_templates(paths: Iterable[str]) -> List[str]:
    res = []
    for p in paths:
        if p.startswith(".github/PULL_REQUEST_TEMPLATE/") and p.endswith(".md"):
            res.append(p)
        elif p == ".github/pull_request_template.md":
            res.append(p)
    return res

def repo_abspath(relpath: str) -> str:
    return os.path.abspath(os.path.join(REPO_ROOT, relpath))