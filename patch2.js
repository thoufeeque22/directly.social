const fs = require('fs');
let content = fs.readFileSync('src/components/schedule/CalendarView.tsx', 'utf8');

// replace PostActivityEntry import with PostActivityEntry and PlatformResult
content = content.replace("import { PostActivityEntry } from '@/app/schedule/types';", "import { PostActivityEntry, PlatformResult } from '@/app/schedule/types';");

fs.writeFileSync('src/components/schedule/CalendarView.tsx', content);
