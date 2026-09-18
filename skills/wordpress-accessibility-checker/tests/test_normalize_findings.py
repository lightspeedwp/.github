import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "normalize_findings.py"
FIXTURE = ROOT / "fixtures" / "sample_findings.csv"


def test_normalize_findings_csv_outputs_expected_shape(tmp_path):
    output = tmp_path / "findings.json"
    subprocess.run([sys.executable, str(SCRIPT), str(FIXTURE), "--output", str(output)], check=True)
    data = json.loads(output.read_text(encoding="utf-8"))
    assert data["count"] == 4
    first = data["findings"][0]
    assert first["issue_id"] == "AC-001"
    assert first["severity"] == "serious"
    assert first["owner"] == "content"
    assert first["safe_to_fix"] is True


def test_normalize_findings_marks_contrast_as_developer_not_safe(tmp_path):
    output = tmp_path / "findings.json"
    subprocess.run([sys.executable, str(SCRIPT), str(FIXTURE), "--output", str(output)], check=True)
    data = json.loads(output.read_text(encoding="utf-8"))
    contrast = [f for f in data["findings"] if "contrast" in f["title"].lower()][0]
    assert contrast["owner"] == "developer"
    assert contrast["safe_to_fix"] is False
