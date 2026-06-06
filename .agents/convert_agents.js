const fs = require('fs');
const path = require('path');
const src = '/Users/thoufeeque/projects/social-studio-app/.gemini/agents';
const dest = '/Users/thoufeeque/projects/social-studio-app/.agents/agents';

fs.mkdirSync(dest, {recursive: true});
const files = fs.readdirSync(src).filter(f => f.endsWith('.md'));

for (const f of files) {
  const txt = fs.readFileSync(path.join(src, f), 'utf8');
  const parts = txt.split('---');
  if (parts.length >= 3) {
    const fm = parts[1].trim().split('\n');
    const obj = {};
    fm.forEach(l => {
      const idx = l.indexOf(':');
      if (idx > -1) {
        const k = l.slice(0, idx).trim();
        let v = l.slice(idx + 1).trim();
        if (v.startsWith('[') && v.endsWith(']')) {
          try { v = JSON.parse(v); } catch (e) {}
        } else if (v.startsWith('"') && v.endsWith('"')) {
          v = v.slice(1, -1);
        }
        obj[k] = v;
      }
    });
    obj.system_prompt = parts.slice(2).join('---').trim();
    const name = obj.name || path.basename(f, '.md');
    const dir = path.join(dest, name);
    fs.mkdirSync(dir, {recursive: true});
    fs.writeFileSync(path.join(dir, 'agent.json'), JSON.stringify(obj, null, 2));
    console.log(`✅ Created agent configuration for: ${name}`);
  }
}
