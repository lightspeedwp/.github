# MCP write-response quirks — verify, don't retry

MCP servers sometimes **misreport a successful write as an error.** The reported result and the actual outcome can diverge in *both* directions, so never treat either string as ground truth.

## Known shape: success reported as a schema error

A write call (e.g. `update_pages` / `update_posts`) returns something like:

```
MCP server returned a malformed result that failed schema validation:
content expected array, received object
```

…but **the write landed.** This is a response-serialisation bug in the server, not a failed write.

## The rule

**On a write-then-error, do not blindly retry.** Retrying a destructive content replace can double-apply or clobber good data. Instead **verify against the DB** with a compact read:

```sql
SELECT CHAR_LENGTH(post_content), LEFT(post_content, 60) FROM wp_posts WHERE ID = <id>;
```

Only re-issue the write if verification shows it truly didn't take.

## Corollary

The inverse also happens — a call that *reports* success while a downstream cache makes the change look absent (see `caching.md`). Both cases resolve the same way: **verify against the DB, act on the DB state, not on the tool's message.**
