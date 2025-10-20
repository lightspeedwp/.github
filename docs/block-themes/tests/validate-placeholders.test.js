const fs = require('fs');
const glob = require('glob');

const files = glob.sync('**/*.{js,php,css,json,md,scss}', { ignore: ['node_modules/**', 'build/**'] });

let failed = false;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.match(/{{\s*[\w_-]+\s*}}/)) {
    console.error(`Unreplaced placeholder found in ${file}`);
    failed = true;
  }
});

if (failed) {
  process.exit(1);
} else {
  console.log('All placeholders replaced.');
}