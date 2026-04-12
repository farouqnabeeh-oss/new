const fs = require('fs');
const content = fs.readFileSync('src/lib/seed-data.ts', 'utf8');
const prodsEn = [];
const prodsAr = [];

// Match simple product objects
const prodMatches = content.matchAll(/name_ar: \"([^\"]+)\", name_en: \"([^\"]+)\"/g);
for (const m of prodMatches) {
    prodsAr.push(m[1]);
    prodsEn.push(m[2]);
}

// Match multi-line product objects
const blockMatches = content.matchAll(/name_ar: \"([^\"]+)\",\s+name_en: \"([^\"]+)\"/g);
for (const m of blockMatches) {
    prodsAr.push(m[1]);
    prodsEn.push(m[2]);
}

const dupsEn = prodsEn.filter((p, i) => prodsEn.indexOf(p) !== i);
const dupsAr = prodsAr.filter((p, i) => prodsAr.indexOf(p) !== i);

console.log('Duplicate English:', [...new Set(dupsEn)]);
console.log('Duplicate Arabic:', [...new Set(dupsAr)]);
