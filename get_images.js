const fs = require('fs');
const content = fs.readFileSync('src/lib/mock.ts', 'utf8');

const items = ["شاي", "سموذي طبيعي", "ميلك شيك", "اسبريسو"];
items.forEach(name => {
    const regex = new RegExp('nameAr: "' + name + '"[\\s\\S]+?imagePath: "([^"]+)"');
    const m = content.match(regex);
    console.log(`${name}: ${m ? m[1] : 'not found'}`);
});
