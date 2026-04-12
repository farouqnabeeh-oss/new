const fs = require('fs');
let data = fs.readFileSync('src/lib/mock.ts', 'utf-8');

// Fix ساندويش أسايدو (id 1005) - price should be 36, basePrice=40 for 10% disc
data = data.replace(
  /(id: 1005,[^}]+?basePrice: )\d+(, discount: )\d+/s,
  '$140$210'
);

// Fix سبانش لاتيه cold (id 1061) - should be 17 final, basePrice=19
data = data.replace(
  /(id: 1061,[^}]+?basePrice: )\d+/s,
  '$119'
);

// Fix سبانش لاتيه hot (id 1104) - should be 15 final, basePrice=17
data = data.replace(
  /(id: 1104,[^}]+?basePrice: )\d+/s,
  '$117'
);

fs.writeFileSync('src/lib/mock.ts', data, 'utf-8');

// Verify key products
console.log('Verifying key products:');
const checks = [
  { id: '1005', name: 'Asado Sandwich', expected: 36 },
  { id: '1061', name: 'Spanish Latte Cold', expected: 17 },
  { id: '1104', name: 'Spanish Latte Hot', expected: 15 },
];
for (const c of checks) {
  const m = data.match(new RegExp('id: ' + c.id + ',[^}]+?basePrice: (\\d+), discount: (\\d+)', 's'));
  if (m) {
    const bp = parseInt(m[1]);
    const disc = parseInt(m[2]);
    const final = Math.round(bp * (1 - disc / 100));
    console.log((final === c.expected ? 'OK' : 'FAIL') + ' ' + c.name + ': base=' + bp + ', disc=' + disc + '%, final=' + final + ' (expected ' + c.expected + ')');
  } else {
    console.log('NOT FOUND: ' + c.name);
  }
}

// Check for any product with discount: 0
const noDiscMatches = data.match(/nameAr: "([^"]+)"[^}]*?discount: 0/gs);
if (noDiscMatches && noDiscMatches.length > 0) {
  console.log('\nProducts with discount: 0 (' + noDiscMatches.length + '):');
  noDiscMatches.forEach(m => {
    const name = m.match(/nameAr: "([^"]+)"/);
    if (name) console.log('  - ' + name[1]);
  });
} else {
  console.log('\nAll products have discount > 0');
}
