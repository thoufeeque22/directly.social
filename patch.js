const fs = require('fs');
let content = fs.readFileSync('src/components/schedule/CalendarView.tsx', 'utf8');

// replace PlatformResult interface and PostActivityEntry interface
content = content.replace(/interface PlatformResult \{[\s\S]*?\}\s*/, '');
content = content.replace(/interface PostActivityEntry \{[\s\S]*?\}\s*/, "import { PostActivityEntry } from '@/app/schedule/types';\n\n");

fs.writeFileSync('src/components/schedule/CalendarView.tsx', content);
