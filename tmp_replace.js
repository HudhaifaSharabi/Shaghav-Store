const fs = require('fs');

const files = [
  'src/app/products/[id]/page.tsx',
  'src/app/products/page.tsx',
  'src/app/page.tsx',
  'src/app/faq/page.tsx',
  'src/app/about/page.tsx'
];

const replacements = {
  'ANALIA-semantic-bg-dark': 'ANALIA-dark-bg',
  'ANALIA-semantic-bg': 'ANALIA-light-bg',
  'ANALIA-semantic-text-dark': 'ANALIA-dark-text',
  'ANALIA-semantic-text': 'ANALIA-light-text',
  'ANALIA-semantic-heading': 'ANALIA-light-heading',
  'ANALIA-charcoal': 'ANALIA-light-text',
  'ANALIA-cream': 'ANALIA-light-bg',
  'ANALIA-black': 'black'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [oldVal, newVal] of Object.entries(replacements)) {
    content = content.replace(new RegExp(oldVal, 'g'), newVal);
  }
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
