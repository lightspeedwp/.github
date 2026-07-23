# Deploy ordering — the fatal-lockout trap

**Rule: when deploying a multi-file change over an MCP file tool, push in dependency order — new/required files FIRST, the file that `require`s them LAST. For removals, drop the `require` before deleting the file.**

## Why it bites so hard

An MCP server exposed by a WordPress plugin is itself a WordPress request, and WordPress loads **every active plugin on every request**. So if you `put_file` a main plugin file that `require_once`s modules that aren't on disk yet, the *next* request fatals at bootstrap:

```
Failed opening required '.../modules/events.php'
```

Because the MCP endpoint is a WP request too, **every subsequent MCP call dies at the same fatal before your fix can run.** You cannot self-recover: `put_file`, `db_query`, activate — all die at bootstrap.

WordPress's WSOD/recovery mode does **not** auto-pause the plugin for front-end/REST requests (it needs the emailed recovery cookie), so the site stays down until a human with SFTP / host file-manager access intervenes.

## Correct ordering

- **Adding** files: push every new/required module **first**, then push the file that `require`s them **last**.
- **Removing** files: remove the `require` line **first** (deploy that edit), then delete the now-unreferenced file.
- Same discipline applies to **theme** files that `require` partials, and to any change where one file's parse depends on another already existing.

## Recovery if you brick it

The minimal out-of-band fix (human, via host file manager / SFTP):

1. Delete the offending `require_once` line(s) in the main plugin file, **or** rename the plugin folder to deactivate it.
2. Confirm the site and MCP endpoint respond again.
3. Resume the deploy over MCP **in the correct dependency order**.

> Example (labelled): this exact lockout happened adding an Events module to a `-enhancements` plugin over a dev AI-Engine MCP — the main file `require_once`'d the module before the module file existed, fataling the endpoint until the require line was hand-deleted in the host file manager.
