/**
 * footerUtils.js
 * Provides fun, randomized signature footers for documentation and README files.
 */

// TODO: Align this helper with the latest automation spec updates.

const fs = require("fs");

/**
 * Array of fun footer variants (add more as desired).
 */
const footers = [
  "_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_\n[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)",
  "_Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!_\n[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)",
  "_Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP_\n[Contact](https://lightspeedwp.agency/contact)",
  "_This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP._\n[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)",
  "_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_",
];

/**
 * Randomly select one of the standard footers.
 */
function getRandomFooter() {
  return footers[Math.floor(Math.random() * footers.length)];
}

/**
 * Ensure the README or doc file ends with a fun footer; replaces existing if found.
 * @param {string} file
 * @returns {boolean} true if file was updated
 */
function ensureFooter(file) {
  let content = fs.readFileSync(file, "utf-8");
  const footerRegex =
    /(_Maintained with ❤️[\s\S]*|_Built by 🧱[\s\S]*|_Have questions\?[\s\S]*|_This page brought to you by[\s\S]*|_Docs signed by 🤖[\s\S]*)$/m;
  const nextFooter = getRandomFooter();
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, nextFooter);
    fs.writeFileSync(file, content);
    return true;
  }
  if (!content.endsWith("\n")) {
    content += "\n";
  }
  content += "\n" + nextFooter + "\n";
  fs.writeFileSync(file, content);
  return true;
}

module.exports = {
  getRandomFooter,
  ensureFooter,
  footers,
};
