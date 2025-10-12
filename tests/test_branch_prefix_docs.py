import os
import re
import unittest
from tests.util_changed_files import repo_abspath

DOCS = [
    "docs/branch-prefixes-client-delivery-v1.md",
    "docs/branch-prefixes-product-development-v1.md",
]

class TestBranchPrefixDocs(unittest.TestCase):
    def test_contains_enforcement_regex(self):
        """
        Validate that each file in DOCS contains a branch-name enforcement regular expression.
        
        For each listed documentation path this test:
        - skips the file if it does not exist,
        - searches the file for either a direct regex example or a fenced code block containing a branch-name pattern,
        - heuristically selects a candidate line that includes branch prefixes (e.g. "feat" and "fix") and a "/" character,
        - asserts a candidate was found and fails the test if not,
        - verifies the candidate compiles as a Python regular expression and fails the test with the compilation error if it does not.
        """
        for rel in DOCS:
            path = repo_abspath(rel)
            if not os.path.exists(path):
                # Skip missing files rather than failing (e.g. if only one variant in this repo)
                continue
            with self.subTest(doc=rel):
                text = open(path, "r", encoding="utf-8", errors="replace").read()
                # Find a line that looks like a branch enforcement regex
                # Match a fenced code block with optional spaces and backticks
                code_block_pattern = re.compile(r"""
                    ^\s*         # Start of line, optional leading whitespace
                    `\s*         # First backtick, optional spaces
                    `?           # Optional second backtick
                    \s*`         # Optional spaces, third backtick
                    \s*\n        # Optional spaces, newline
                    (.*?)        # Non-greedy capture of code block contents
                    \n\s*        # Newline, optional spaces
                    `\s*         # Closing backtick, optional spaces
                    `?           # Optional second closing backtick
                    \s*`         # Optional spaces, third closing backtick
                """, re.S | re.VERBOSE)
                m = code_block_pattern.search(text)
                # If generic fence search fails, search for the specific regex example
                rx = re.search(r"^\^\((feat\|fix\|.*)\)\\?\/\[a-z0-9._-]\+\$$", text, flags=re.M)
                candidate = None
                if rx:
                    candidate = rx.group(0)
                elif m:
                    block = m.group(1).strip()
                    # Heuristic: pick the line containing |feat|fix|hotfix|release|
                    for line in block.splitlines():
                        if "feat" in line and "fix" in line and "/" in line:
                            candidate = line.strip()
                            break
                self.assertIsNotNone(candidate, f"Unable to locate branch name regex in {rel}")
                # Validate it can be compiled as a Python regex (tolerate minor differences)
                try:
                    re.compile(candidate)
                except re.error as e:
                    self.fail(f"Invalid regex in {rel}: {e}")

if __name__ == "__main__":
    unittest.main()