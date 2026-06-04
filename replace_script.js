const fs = require('fs');
const path = require('path');

const targets = [
  'src', 'docs', 'infra', '.github', 'scripts', 'next.config.ts', 'GEMINI.md', 'ios', 'android'
];

const excludes = ['.gemini/state', '.git', 'node_modules', 'tmp'];

function shouldExclude(filePath) {
  return excludes.some(ex => filePath.includes(ex));
}

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    return [dir];
  }
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    if (shouldExclude(file)) return;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

let allFiles = [];
targets.forEach(t => {
  allFiles = allFiles.concat(walk(t));
});

let changedFiles = 0;
allFiles.forEach(file => {
  if (shouldExclude(file)) return;
  try {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // replacements
    content = content.replace(/social-studio/g, 'directly');
    content = content.replace(/socialstudio/g, 'directly');
    content = content.replace(/Social Studio/g, 'Directly.social');
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      changedFiles++;
      console.log('Updated', file);
    }
  } catch (e) {
    // maybe it's a binary file or unreadable, ignore
  }
});
console.log('Total files changed:', changedFiles);
