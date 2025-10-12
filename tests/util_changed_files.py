import os
import subprocess
from typing import List, Iterable

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def _run_git(*args) -> str:
    """
    Run a git command in the repository root and return its stdout decoded as UTF-8.
    
    Parameters:
        *args: Parts of the git command to run (for example: "diff", "main..HEAD", "--name-only").
    
    Returns:
        str: Decoded standard output from the git command, or an empty string if the command fails or git is unavailable.
    """
    try:
        out = subprocess.check_output(["git", *args], cwd=REPO_ROOT, stderr=subprocess.STDOUT)
        return out.decode("utf-8", errors="replace")
    except (subprocess.CalledProcessError, FileNotFoundError, OSError):
        return ""

def list_changed_paths_vs_main() -> List[str]:
    """
    Return the repository paths that are considered changed relative to main.
    
    If the CHANGED_FILES environment variable is set, its non-empty newline-separated entries are returned.
    Otherwise, the function returns paths reported by `git diff main..HEAD --name-only` when available.
    If no git information is available or yields no paths, the function returns all files found under the repository's
    docs/ and .github/ directories (relative to the repository root).
    
    Returns:
        List[str]: Relative repository paths that are considered changed.
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
    """
    Filter an iterable of repository paths to only Markdown files.
    
    Parameters:
        paths (Iterable[str]): Iterable of file paths or path-like strings to filter.
    
    Returns:
        List[str]: List of paths from `paths` that end with the ".md" extension.
    """
    return [p for p in paths if p.endswith(".md")]

def filter_changed_markdown() -> List[str]:
    """
    Collect markdown file paths that changed between the repository's main branch and HEAD.
    
    Returns:
        List[str]: Paths to Markdown files that were detected as changed between main and HEAD.
    """
    return filter_markdown(list_changed_paths_vs_main())

def filter_pr_templates(paths: Iterable[str]) -> List[str]:
    """
    Selects pull request template Markdown files from an iterable of repository-relative paths.
    
    Parameters:
        paths (Iterable[str]): Iterable of repository-relative file paths to filter.
    
    Returns:
        pr_template_paths (List[str]): List of paths that are pull request templates — files under
        ".github/PULL_REQUEST_TEMPLATE/" with a ".md" suffix, and the file ".github/pull_request_template.md".
    """
    res = []
    for p in paths:
        if p.startswith(".github/PULL_REQUEST_TEMPLATE/") and p.endswith(".md"):
            res.append(p)
        elif p == ".github/pull_request_template.md":
            res.append(p)
    return res

def repo_abspath(relpath: str) -> str:
    """
    Convert a repository-relative path to an absolute filesystem path.
    
    Parameters:
        relpath (str): Path relative to the repository root; may refer to a file or directory.
    
    Returns:
        str: Absolute, normalized filesystem path corresponding to `relpath`.
    """
    return os.path.abspath(os.path.join(REPO_ROOT, relpath))