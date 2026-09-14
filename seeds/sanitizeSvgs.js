const fs = require('fs');
const path = require('path');

const imgDir = path.resolve(__dirname, '../../frontend/assets/images');
const files = fs.readdirSync(imgDir);

files.forEach(file => {
  if (file.endsWith('.svg')) {
    const fullPath = path.join(imgDir, file);
    let content = fs.readFileSync(fullPath, 'utf8').trim();
    if (!content.startsWith('<?xml')) {
      content = '<?xml version="1.0" encoding="utf-8"?>\n' + content;
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Cleaned SVG: ${file}`);
  }
});

console.log('All SVGs sanitized successfully!');
