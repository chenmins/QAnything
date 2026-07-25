const fs = require('fs');
const path = require('path');

const vueMajorVersion = require('vue/package.json').version.split('.')[0];

if (!['2', '3'].includes(vueMajorVersion)) {
  throw new Error(`Unsupported Vue version: ${require('vue/package.json').version}`);
}

['docx', 'excel', 'pdf'].forEach(packageName => {
  const packageRoot = path.dirname(require.resolve(`@vue-office/${packageName}/package.json`));
  const libRoot = path.join(packageRoot, 'lib');
  const versionedRoot = path.join(libRoot, `v${vueMajorVersion}`);
  const sourceEntry = path.join(versionedRoot, 'index.js');
  const targetEntry = path.join(libRoot, 'index.js');

  if (!fs.existsSync(sourceEntry)) {
    throw new Error(`Missing @vue-office/${packageName} Vue ${vueMajorVersion} entry: ${sourceEntry}`);
  }

  fs.copyFileSync(sourceEntry, targetEntry);

  const sourceStyle = path.join(versionedRoot, 'index.css');
  if (fs.existsSync(sourceStyle)) {
    fs.copyFileSync(sourceStyle, path.join(libRoot, 'index.css'));
  }

  console.log(`Configured @vue-office/${packageName} for Vue ${vueMajorVersion}`);
});
