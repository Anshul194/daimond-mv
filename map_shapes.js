const fs = require('fs');
const path = require('path');
const dir = 'public/attribute-images';

const files = fs.readdirSync(dir);
const mapping = {};

files.forEach(file => {
    if (file.startsWith('profile-') && file.endsWith('.svg')) {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const match = content.match(/sodipodi:docname=['"](.*?)['"]/);
        if (match) {
            mapping[file] = match[1];
        }
    }
});

console.log(JSON.stringify(mapping, null, 2));
