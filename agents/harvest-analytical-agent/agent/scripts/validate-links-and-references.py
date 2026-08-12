"""Link and reference validator specification.

Checks:
- Referenced files exist.
- File paths are accurate.
- Renamed files are not still referenced.
- Entity-tag targets exist where entity tags or anchor-style links are used.
- Template, schema, and example pairings point to existing files.
- Script references point to existing files.
- No references point to the deep research file as permanent knowledge.

Severity rules:
- Broken file reference -> Error
- Suspicious stale reference -> Warning
- Optional missing future file -> Notice
"""
