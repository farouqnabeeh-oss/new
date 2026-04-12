const fs = require('fs');

function cleanFile(path) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    let lines = content.split('\n');
    let newLines = lines.filter(line => !line.includes('كولا تشات'));
    fs.writeFileSync(path, newLines.join('\n'));
    console.log(`Cleaned ${path}`);
}

cleanFile('src/lib/mock.ts');
cleanFile('src/lib/seed-data.ts');
