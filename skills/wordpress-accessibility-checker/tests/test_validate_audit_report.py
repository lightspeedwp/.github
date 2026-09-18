import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "validate_audit_report.py"
TEMPLATE = ROOT / "templates" / "audit-report.md"


def test_audit_report_template_validates():
    subprocess.run([sys.executable, str(SCRIPT), str(TEMPLATE)], check=True)


def test_validator_rejects_unsupported_compliance_claim(tmp_path):
    report = tmp_path / "bad-report.md"
    report.write_text(
        "# Accessibility Checker Audit\n\n"
        "## Summary\nFully compliant.\n\n"
        "## Findings\n\n"
        "## Manual Follow-Ups\n\n"
        "## Limitations\n\n"
        "## Next Actions\n\n",
        encoding="utf-8",
    )
    result = subprocess.run([sys.executable, str(SCRIPT), str(report)], text=True, capture_output=True)
    assert result.returncode == 1
    assert "Risky unsupported claim" in result.stdout
