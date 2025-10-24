// Shim: expose canonical parser from .github/scripts to preserve existing require paths.
module.exports = require(require('path').join(__dirname, '.github', 'scripts', 'yaml-parser.js'));
