# REST API Contract: Changelog Agent (Optional, Future)

**Feature**: 016-changelog-agent-quality

**Version**: 1.0.0-draft

**Date**: 2026-09-19

**Status**: Design only; not implemented in Phase 1

---

## Overview

This contract defines the optional REST API interface for the changelog agent. The API is NOT required for Phase 1 delivery but is designed for future external agent integration.

**Note**: Phase 1 focuses on npm CLI. REST API implementation deferred to Phase 2 or later if external integration becomes necessary.

---

## API Endpoints

### POST /api/skills/changelog-validate

**Purpose**: Validate changelog entries via HTTP

**Authentication**: Bearer token or GitHub App token

**Request Body**:

```json
{
  "changelog_path": "./CHANGELOG.md",
  "changelog_content": "# Changelog\n... (optional; inline content)",
  "output_format": "json"
}
```

**Response (200 OK)**:

```json
{
  "valid": false,
  "entries_total": 12,
  "entries_valid": 10,
  "entries_invalid": 2,
  "errors": [
    {
      "entry_id": "entry_001",
      "line_number": 15,
      "error_code": "LENGTH",
      "message": "Entry exceeds 250-character limit",
      "suggestion": "Shorten to focus on user-facing benefit"
    }
  ]
}
```

**Response (400 Bad Request)**:

```json
{
  "error": "INVALID_REQUEST",
  "message": "Missing required parameter: changelog_path",
  "timestamp": "2026-09-19T14:32:15Z"
}
```

---

### POST /api/skills/changelog-check-links

**Purpose**: Verify PR/issue links via HTTP

**Request Body**:

```json
{
  "changelog_path": "./CHANGELOG.md",
  "github_repo": "lightspeedwp/.github",
  "strict": false
}
```

**Response (200 OK)**:

```json
{
  "valid": true,
  "links_checked": 25,
  "links_valid": 24,
  "links_invalid": 0,
  "errors": []
}
```

---

### POST /api/skills/changelog-merge

**Purpose**: Merge changelog entries via HTTP

**Request Body**:

```json
{
  "changelog_path": "./CHANGELOG.md",
  "version": "1.0.0",
  "release_date": "2026-09-20",
  "dry_run": false
}
```

**Response (200 OK)**:

```json
{
  "success": true,
  "version": "1.0.0",
  "entries_merged": 12,
  "backup_file": ".changelog-backup-20260919-143520.md"
}
```

---

## Implementation Notes

- **Not implemented in Phase 1**: CLI is primary interface
- **Optional in Phase 2**: Add if external agent integration is needed
- **Framework agnostic**: Can be built with Express, Fastify, or any Node.js framework
- **Authentication**: Use GitHub App token for PR verification; require Bearer token for mutations
- **Rate limiting**: Apply per-IP rate limits (100 requests/minute default)

---

## Future Considerations

1. WebSocket support for long-running merges
2. Webhook integration for automatic validation on PR creation
3. GraphQL alternative to REST API
4. Streaming JSON response for large changelogs
