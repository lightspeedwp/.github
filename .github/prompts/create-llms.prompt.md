---
mode: "agent"
description: "Create an llms.txt file from scratch based on repository structure following the llms.txt specification at https://llmstxt.org/"
tools:
  [
    "changes",
    "search/codebase",
    "edit/editFiles",
    "extensions",
    "fetch",
    "githubRepo",
    "openSimpleBrowser",
    "problems",
    "runTasks",
    "search",
    "search/searchResults",
    "runCommands/terminalLastCommand",
    "runCommands/terminalSelection",
    "testFailure",
    "usages",
    "vscodeAPI",
  ]
---
