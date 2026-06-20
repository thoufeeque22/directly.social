
## [2026-06-20 19:30:47] Verdict: APPROVED
# Product Specification: Local FileSystem Vault (Ticket #651)

## Verdict: APPROVED

## Socratic Log & Ambiguity Resolution
During the initial requirements review, the following key architectural and UX ambiguities were identified and resolved:
1. **Platform Detection & Branching:** Since `window.showDirectoryPicker()` is a web-only API and Capacitor Filesystem is mobile-only, the UI must dynamically detect the platform environment (browser vs. native container) to present the correct "Local Vault" interface.
2. **IndexedDB Directory Handle Storage:** Web browsers automatically revoke directory handle permissions across sessions/reloads. We resolve this by checking handle validity on load, displaying a non-disruptive warning/alert box, and providing a single-click "Restore Access" action to trigger the required user gesture to re-request permission.
3. **Capacitor Filesystem Access:** For the mobile app, Capacitor Filesystem doesn't natively expose a broad directory tree browser due to OS sandboxing. We resolve this by designating standard app-scoped folders (like the app's `Documents` and `Data` folders) as the mobile vault root, and providing a native iOS/Android file/gallery selector to import media assets directly into the vault.
4. **Local Video Rendering:** To prevent uploading heavy video assets to the cloud, the app will generate temporary blob URLs using `URL.createObjectURL(file)` on the web, and convert file paths using `Capacitor.convertFileSrc(filePath)` on mobile.
5. **Asset Retention Policy:** Unlike cloud media library assets which expire after 7 days, local vault assets do not expire as they are stored on the user's hard drive. The UI will explicitly display a "Local Vault" badge rather than an expiration warning.

---

## Competitive Research & Industry Standards
We analyzed industry leaders on their implementation of browser-based and native local storage interactions:
- **VS Code Web (vscode.dev):** VS Code web uses the File System Access API to mount folders. It persists handles in IndexedDB and uses a warning banner to re-request permission upon subsequent visits.
- **Figma (Desktop/Web):** Figma lets users link local font directories and design assets, caching permissions and handle states client-side.
- **Photopea:** A fully local-first image editor that reads local files directly via `showOpenFilePicker` and `showDirectoryPicker`, bypassing cloud processing.
- **Mobile Native Apps (e.g., Lightroom Mobile):** Use native file pickers and Capacitor Filesystem to access app-specific workspaces or copy files into app sandboxes.

---

## UX Strategy & Optimal Flow
1. **Tabbed Library Navigation:** The primary `MediaLibrary` interface is split into two tabs: `Cloud Gallery` (existing) and `Local Vault` (new).
2. **First-Time Connection Flow (Web):**
   - User goes to `Local Vault` -> Selects `Connect Directory`.
   - Browser folder picker opens -> User selects folder -> Approves browser permission dialog.
   - Folder handle is stored in IndexedDB.
   - App parses the directory, listing video files (`.mp4`, `.mov`, `.webm`, etc.).
3. **Subsequent Session Flow (Web):**
   - App loads -> Retrieves handle from IndexedDB -> Queries permission status.
   - If permission is not active, displays the "Access Expired" state.
   - Clicking "Restore Access" opens the browser permission dialog (gesture-bound) -> Vault contents are instantly loaded.
4. **First-Time Connection Flow (Mobile):**
   - User goes to `Local Vault` -> Displays standard device workspace directories (`Documents` or native gallery picker).
   - User imports videos using native picker -> Copied to the app's workspace and indexed.
5. **Zero Cloud Interaction:** All media previews and composer references leverage local blob URLs (`URL.createObjectURL(file)`) or Capacitor source conversion, saving network bandwidth and guaranteeing user privacy.

---

## UI Layout & Material UI Component Design
The interface is designed using standard Material UI components to align with theme awareness and our accessibility (A11y) standards:
1. **Library Header & Tabs:**
   - A `Tabs` component from `@mui/material` is placed below the `Media Gallery` title.
     - `<Tab label="Cloud Gallery" icon={<CloudQueueIcon />} />`
     - `<Tab label="Local Vault" icon={<FolderOpenIcon />} />`
2. **Local Vault State Machine Layout:**
   - **State A: Unconnected / First Load**
     - A centered `Box` with `Paper` container (elevation 0, p: 4, border: '1px solid', borderColor: 'divider').
     - Icon: `<FolderSpecialIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />`
     - Typography: "Local FileSystem Vault" (h5, bold), and helper text (body2) about privacy and storage optimization.
     - Button: `<Button variant="contained" startIcon={<FolderOpenIcon />}>Connect Local Directory</Button>`
   - **State B: Permission Expired (Session Reload)**
     - Displays a clean warning card using `Alert` component.
     - Alert: `severity="warning"`, message: "Access to the connected directory needs to be restored to read assets."
     - Button: `<Button variant="contained" color="warning" size="small">Restore Access</Button>`
   - **State C: Active Connected Vault**
     - Controls Row:
       - Typography displaying the directory name: "Vault: /downloads/social-media" (body2, text.secondary).
       - Button Stack:
         - Refresh button: `<IconButton><RefreshIcon /></IconButton>`
         - Disconnect button: `<Button variant="outlined" color="error" startIcon={<LinkOffIcon />}>Disconnect</Button>`
     - Asset Grid:
       - Same layout as the current `MediaLibraryGrid` using `Grid2` or styled CSS Grid.
       - Each asset is represented by a `MediaAssetCard`.
       - Instead of showing the "expires in N days" badge, local vault assets show a permanent green badge: `<Chip size="small" label="Local Vault" color="success" variant="outlined" />`.
3. **No-Emoji Enforcement:**
   - No emojis are used in buttons or text. Only Material UI Icons (`CloudQueue`, `FolderOpen`, `FolderSpecial`, `Refresh`, `LinkOff`, `Delete`, `Movie`) are utilized.
4. **Theme & CSS Variables:**
   - All color stylings use system variables, e.g., `bgcolor: 'background.paper'` and `borderColor: 'divider'`. No hardcoded hex or color names.


## [2026-06-20 19:30:59] Verdict: APPROVED
# Product Specification: Local FileSystem Vault (Ticket #651)

## Verdict: APPROVED

## Socratic Log & Ambiguity Resolution
During the initial requirements review, the following key architectural and UX ambiguities were identified and resolved:
1. **Platform Detection & Branching:** Since `window.showDirectoryPicker()` is a web-only API and Capacitor Filesystem is mobile-only, the UI must dynamically detect the platform environment (browser vs. native container) to present the correct "Local Vault" interface.
2. **IndexedDB Directory Handle Storage:** Web browsers automatically revoke directory handle permissions across sessions/reloads. We resolve this by checking handle validity on load, displaying a non-disruptive warning/alert box, and providing a single-click "Restore Access" action to trigger the required user gesture to re-request permission.
3. **Capacitor Filesystem Access:** For the mobile app, Capacitor Filesystem doesn't natively expose a broad directory tree browser due to OS sandboxing. We resolve this by designating standard app-scoped folders (like the app's `Documents` and `Data` folders) as the mobile vault root, and providing a native iOS/Android file/gallery selector to import media assets directly into the vault.
4. **Local Video Rendering:** To prevent uploading heavy video assets to the cloud, the app will generate temporary blob URLs using `URL.createObjectURL(file)` on the web, and convert file paths using `Capacitor.convertFileSrc(filePath)` on mobile.
5. **Asset Retention Policy:** Unlike cloud media library assets which expire after 7 days, local vault assets do not expire as they are stored on the user's hard drive. The UI will explicitly display a "Local Vault" badge rather than an expiration warning.

---

## Competitive Research & Industry Standards
We analyzed industry leaders on their implementation of browser-based and native local storage interactions:
- **VS Code Web (vscode.dev):** VS Code web uses the File System Access API to mount folders. It persists handles in IndexedDB and uses a warning banner to re-request permission upon subsequent visits.
- **Figma (Desktop/Web):** Figma lets users link local font directories and design assets, caching permissions and handle states client-side.
- **Photopea:** A fully local-first image editor that reads local files directly via `showOpenFilePicker` and `showDirectoryPicker`, bypassing cloud processing.
- **Mobile Native Apps (e.g., Lightroom Mobile):** Use native file pickers and Capacitor Filesystem to access app-specific workspaces or copy files into app sandboxes.

---

## UX Strategy & Optimal Flow
1. **Tabbed Library Navigation:** The primary `MediaLibrary` interface is split into two tabs: `Cloud Gallery` (existing) and `Local Vault` (new).
2. **First-Time Connection Flow (Web):**
   - User goes to `Local Vault` -> Selects `Connect Directory`.
   - Browser folder picker opens -> User selects folder -> Approves browser permission dialog.
   - Folder handle is stored in IndexedDB.
   - App parses the directory, listing video files (`.mp4`, `.mov`, `.webm`, etc.).
3. **Subsequent Session Flow (Web):**
   - App loads -> Retrieves handle from IndexedDB -> Queries permission status.
   - If permission is not active, displays the "Access Expired" state.
   - Clicking "Restore Access" opens the browser permission dialog (gesture-bound) -> Vault contents are instantly loaded.
4. **First-Time Connection Flow (Mobile):**
   - User goes to `Local Vault` -> Displays standard device workspace directories (`Documents` or native gallery picker).
   - User imports videos using native picker -> Copied to the app's workspace and indexed.
5. **Zero Cloud Interaction:** All media previews and composer references leverage local blob URLs (`URL.createObjectURL(file)`) or Capacitor source conversion, saving network bandwidth and guaranteeing user privacy.

---

## UI Layout & Material UI Component Design
The interface is designed using standard Material UI components to align with theme awareness and our accessibility (A11y) standards:
1. **Library Header & Tabs:**
   - A `Tabs` component from `@mui/material` is placed below the `Media Gallery` title.
     - `<Tab label="Cloud Gallery" icon={<CloudQueueIcon />} />`
     - `<Tab label="Local Vault" icon={<FolderOpenIcon />} />`
2. **Local Vault State Machine Layout:**
   - **State A: Unconnected / First Load**
     - A centered `Box` with `Paper` container (elevation 0, p: 4, border: '1px solid', borderColor: 'divider').
     - Icon: `<FolderSpecialIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />`
     - Typography: "Local FileSystem Vault" (h5, bold), and helper text (body2) about privacy and storage optimization.
     - Button: `<Button variant="contained" startIcon={<FolderOpenIcon />}>Connect Local Directory</Button>`
   - **State B: Permission Expired (Session Reload)**
     - Displays a clean warning card using `Alert` component.
     - Alert: `severity="warning"`, message: "Access to the connected directory needs to be restored to read assets."
     - Button: `<Button variant="contained" color="warning" size="small">Restore Access</Button>`
   - **State C: Active Connected Vault**
     - Controls Row:
       - Typography displaying the directory name: "Vault: /downloads/social-media" (body2, text.secondary).
       - Button Stack:
         - Refresh button: `<IconButton><RefreshIcon /></IconButton>`
         - Disconnect button: `<Button variant="outlined" color="error" startIcon={<LinkOffIcon />}>Disconnect</Button>`
     - Asset Grid:
       - Same layout as the current `MediaLibraryGrid` using `Grid2` or styled CSS Grid.
       - Each asset is represented by a `MediaAssetCard`.
       - Instead of showing the "expires in N days" badge, local vault assets show a permanent green badge: `<Chip size="small" label="Local Vault" color="success" variant="outlined" />`.
3. **No-Emoji Enforcement:**
   - No emojis are used in buttons or text. Only Material UI Icons (`CloudQueue`, `FolderOpen`, `FolderSpecial`, `Refresh`, `LinkOff`, `Delete`, `Movie`) are utilized.
4. **Theme & CSS Variables:**
   - All color stylings use system variables, e.g., `bgcolor: 'background.paper'` and `borderColor: 'divider'`. No hardcoded hex or color names.

