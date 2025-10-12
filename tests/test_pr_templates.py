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
        """
        Prepare the list of pull request template files to validate.
        
        Populates self.templates with the subset of candidate PR template paths that exist in the repository. Candidates are taken from changed paths (via list_changed_paths_vs_main and filter_pr_templates); if no changed templates are found, the repository is scanned for templates under .github/PULL_REQUEST_TEMPLATE and the optional .github/pull_request_template.md.
        """
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
        """
        Verify each PR template contains the required headings and checklist bullet.
        
        For every path in self.templates, read the template file and assert it includes at least one heading that matches each pattern in REQUIRED_HEADINGS and a checklist item that matches REQUIRED_CHECKLIST_BULLET. Fails with a message identifying the missing element and the template path.
        """
        for p in self.templates:
            with self.subTest(p=p):
                text = open(repo_abspath(p), "r", encoding="utf-8", errors="replace").read()
                for rx in REQUIRED_HEADINGS:
                    self.assertRegex(text, rx, f"Missing required heading in {p}: {rx.pattern}")
                self.assertRegex(text, REQUIRED_CHECKLIST_BULLET, f"Missing checklist bullet in {p}")

if __name__ == "__main__":
    unittest.main()