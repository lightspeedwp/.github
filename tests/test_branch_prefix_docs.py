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
        for rel in DOCS:
            path = repo_abspath(rel)
            if not os.path.exists(path):
                # Skip missing files rather than failing (e.g. if only one variant in this repo)
                continue
            with self.subTest(doc=rel):
                text = open(path, "r", encoding="utf-8", errors="replace").read()
                # Find a line that looks like a branch enforcement regex
                m = re.search(r"^\s*`\s*`?\s*`\s*\n(.*?)\n\s*`\s*`?\s*`", text, flags=re.S)
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