const fs = require('fs');
let file = fs.readFileSync('src/lib/products.ts', 'utf-8');
const arMap = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
file = file.replace(/[٠-٩]/g, match => arMap[match]);
fs.writeFileSync('src/lib/products.ts', file);
console.log('Converted numerals successfully');
