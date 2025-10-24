#!/usr/bin/env node
// Thin shim to invoke canonical implementation now located under .github/scripts.
// This preserves existing npm script / tooling references to `node update-readme.js`.

const path = require('path');
require(path.join(__dirname, '.github', 'scripts', 'update-readme.js'));
