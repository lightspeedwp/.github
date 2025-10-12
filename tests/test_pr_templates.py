import os
import re
import unittest
from tests.util_changed_files import list_changed_paths_vs_main, filter_pr_templates, repo_abspath

REQUIRED_HEADINGS = [
    re.compile(r"^##\s+Linked issues", re.I | re.M),
    re.compile(r"^##\s+Changelog", re.I | re.M),
]
REQUIRED_CHECKLIST_BULLET = re.compile(r"CI green; linked issues closed; release notes prepared", re.I)

class TestPullRequestTemplates(unittest.TestCase):
    def setUp(self):
        changed = list_changed_paths_vs_main()
        candidates = filter_pr_templates(changed)
        # If no changed PR templates, still validate all templates existing in repo
        if not candidates:
            for path in (".github/PULL_REQUEST_TEMPLATE",):
                absd = repo_abspath(path)
                if os.path.isdir(absd):
                    for f in os.listdir(absd):
                        if f.endswith(".md"):
                            candidates.append(os.path.join(".github/PULL_REQUEST_TEMPLATE", f))
            if os.path.exists(repo_abspath(".github/pull_request_template.md")):
                candidates.append(".github/pull_request_template.md")
        self.templates = [p for p in candidates if os.path.exists(repo_abspath(p))]

    def test_templates_have_required_sections(self):
        for p in self.templates:
            with self.subTest(p=p):
                text = open(repo_abspath(p), "r", encoding="utf-8", errors="replace").read()
                for rx in REQUIRED_HEADINGS:
                    self.assertRegex(text, rx, f"Missing required heading in {p}: {rx.pattern}")
                self.assertRegex(text, REQUIRED_CHECKLIST_BULLET, f"Missing checklist bullet in {p}")

if __name__ == "__main__":
    unittest.main()