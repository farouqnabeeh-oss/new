const fs = require('fs');
let data = fs.readFileSync('src/lib/mock.ts', 'utf-8');

// Fix each burger by ID with correct price and discount: 10
const burgerPrices = {
  1131: 23, 1132: 35, 1133: 25, 1134: 30, 1135: 30,
  1136: 30, 1137: 30, 1138: 36, 1139: 45, 1140: 30,
  1141: 30, 1142: 30, 1143: 36, 1144: 25, 1145: 25,
  1146: 30, 1147: 30, 1148: 30
};

for (const [idStr, price] of Object.entries(burgerPrices)) {
  const id = parseInt(idStr);
  // Fix empty basePrice: , → basePrice: XX,
  data = data.replace(
    new RegExp('(id: ' + id + ', nameAr:[^}]+?basePrice: )(,)', 's'),
    '$1' + price + '$2'
  );
  // Ensure discount is 10 for this burger
  data = data.replace(
    new RegExp('(id: ' + id + ', nameAr:[^}]+?discount: )\\d+', 's'),
    '$1' + 10
  );
}

fs.writeFileSync('src/lib/mock.ts', data, 'utf-8');

// Verify no empty basePrices remain in burgers
const lines = data.split('\n');
const broken = lines.filter(l => l.includes('basePrice: ,') && l.includes('categoryId: 113'));
if (broken.length === 0) {
  console.log('SUCCESS: All burger prices fixed!');
} else {
  console.log('Still broken:', broken.length, 'lines');
  broken.forEach(l => console.log(l.trim()));
}
