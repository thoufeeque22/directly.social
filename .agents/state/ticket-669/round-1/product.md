## [2026-06-20 11:17:09] Verdict: APPROVED
# UX Strategy & UI Layout Specification: TemplateManager Refactoring (Ticket #669)

## 1. Socratic Interrogation & Benchmarking Log

### A. Competitive Research
Modern, professional platforms (e.g., Postiz, Buffer, HubSpot) approach metadata template and reusable snippet managers with a focus on quick search, visual clarity, and inline utility.
- **Postiz / Buffer:** Use grid cards with prominent title labeling and content previews. Because snippet lists can grow large, instant reactive search filtering is standard. Actions like delete/edit are kept clean and compact to avoid visual clutter.
- **HubSpot:** Focuses on clear form validation (e.g., templates cannot have empty names or empty contents) and distinct empty/error states to guide users.
- **General Best Practices:** Aligning with a modern component system means avoiding custom inline CSS or hardcoded colors in favor of standardized components (like Material UI cards, inputs, and buttons) that automatically adapt to light/dark/system theme settings.

### B. User Intent (Job to be Done)
*   **Job to be Done (JTBD):** "When drafting social media posts, I want to quickly find, use, and update my standard hashtags, metadata signatures, and reusable text snippets so that I can maintain consistency and speed up my workflow."
*   **Core Tasks:**
    1.  **Read/List:** View all saved snippets.
    2.  **Filter:** Real-time search for snippets by title or text content.
    3.  **Update/Edit:** Inline editing to quickly correct mistakes or refresh copy.
    4.  **Delete:** Remove outdated snippets safely.

### C. Edge Case Analysis & UX Solutions
*   **Empty State (No Snippets):** If the user has no saved snippets, display a friendly, clear empty state using a MUI `Card` with a dashed border, a descriptive icon (e.g., `BookmarkBorder`), and instruction text directing them to save templates from the Upload dashboard.
*   **Search Empty State:** If a search query yields no results, show a descriptive message ("No matching snippets found for '<query>'") along with a text button to "Clear Search".
*   **Loading State:** Instead of a generic loading spinner, use a skeleton layout matching the template card grid (`Skeleton` component from MUI) to minimize layout shifts during load.
*   **Validation Errors:** Forms must validate that both name and content are non-empty. Show MUI `TextField` `error` state and `helperText` rather than triggering browser `alert()` popups.
*   **Extreme Content Size:** Snippets can be extremely long. Constrain card text height using CSS (`maxHeight`, `overflowY: 'auto'`) and apply `wordBreak: 'break-word'` to avoid breaking grid layouts. For long names, truncate with an ellipsis.
*   **Action Failures:** If an API request fails during editing or deletion, show a temporary, non-disruptive feedback message (such as a toast or inline `Alert`) instead of browser alert boxes.

---

## 2. UX Strategy & Flow

*   **Aesthetic Alignment:** Transition the entire template manager interface from raw custom CSS styling to Material UI (MUI) components.
*   **Color & Theme Integrity:** Strictly avoid hardcoded color values. Rely on standard MUI theme variables or HSL theme tokens (e.g., `borderColor: 'divider'`, `backgroundColor: 'background.paper'`).
*   **A11y / Accessibility:**
    *   Ensure all buttons have descriptive `aria-label` tags (especially icon-only buttons).
    *   Inputs must have explicit associated label elements (using MUI `TextField`'s built-in label rendering).
    *   No non-interactive elements (like `div` or `span`) should handle click events; always use buttons.
*   **"No Emojis" Rule:** Remove Lucide-react/custom emojis from user-facing screens and replace them with standard **MUI Icons** (e.g., `BookmarkIcon`, `EditIcon`, `DeleteIcon`, `SearchIcon`, `CheckIcon`, `CloseIcon`, `ErrorOutlineIcon`).

---

## 3. Component Taxonomy & UI Layout

We will refactor the single 250-line `TemplateManager.tsx` file into four highly focused, modular files, keeping each under the 100-line threshold.

```
src/
├── hooks/
│   └── useTemplateManager.ts        # Business logic, state, and API calls (R1)
└── components/settings/
    ├── TemplateManager.tsx          # Main layout container & search bar (R4)
    ├── TemplateListItem.tsx         # Individual card, switching between view/edit (R2)
    └── TemplateForm.tsx             # Reusable form component (R2, R3)
```

### A. The Hook: `useTemplateManager.ts`
All state management, search filtering, and CRUD operations move here:
- **State variables:** `templates`, `isLoading`, `deletingId`, `searchQuery`, `editingId`, `editName`, `editContent`, `isUpdating`.
- **Derived State:** `filteredTemplates` (filtered reactively via `useMemo` based on `searchQuery`).
- **Callbacks:** `fetchTemplates`, `handleStartEdit`, `handleCancelEdit`, `handleUpdate`, `handleDelete`.
- **Validation:** Handles client-side presence validation for edit forms.

### B. The Form: `TemplateForm.tsx`
Renders the form used for editing (and potentially creating) templates.
*   **Props:**
    *   `name`: string (current name value)
    *   `content`: string (current content value)
    *   `isUpdating`: boolean (loading state for save button)
    *   `onNameChange`: (val: string) => void
    *   `onContentChange`: (val: string) => void
    *   `onSave`: () => void
    *   `onCancel`: () => void
*   **UI Layout:**
    *   A vertical `Stack` with a gap of `1.5` (`12px`).
    *   **Name Input:** MUI `TextField` with `label="Snippet Name"`, `variant="outlined"`, `size="small"`, `fullWidth`. Show validation helperText if name is empty.
    *   **Content Input:** MUI `TextField` with `label="Content"`, `variant="outlined"`, `size="small"`, `multiline`, `rows={4}`, `fullWidth`.
    *   **Actions Stack:** A horizontal `Box` aligned to the right:
        *   **Cancel Button:** MUI `Button` with `variant="text"`, `size="small"`, `disabled={isUpdating}`.
        *   **Save Button:** MUI `Button` with `variant="contained"`, `size="small"`, `disabled={isUpdating || !name.trim() || !content.trim()}`, showing a small circular loader inside if updating.

### C. The Item: `TemplateListItem.tsx`
Represents an individual template in the list.
*   **Props:**
    *   `template`: Template object `{ id, name, content }`
    *   `editingId`: string | null (id of the template currently being edited)
    *   `isUpdating`: boolean (updating status)
    *   `deletingId`: string | null (id of the template currently being deleted)
    *   // Form state overrides for this specific item
    *   `editName`: string
    *   `editContent`: string
    *   `setEditName`: (val: string) => void
    *   `setEditContent`: (val: string) => void
    *   // Handlers
    *   `onStartEdit`: (t: Template) => void
    *   `onCancelEdit`: () => void
    *   `onUpdate`: (id: string) => void
    *   `onDelete`: (id: string) => void
*   **UI Layout:**
    *   Wrapped in a MUI `Card` with a subtle border and background (`variant="outlined"`, `sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}`).
    *   **Edit Mode:**
        *   Renders `TemplateForm` embedded inside the card content, passing down the local editing overrides and callbacks.
    *   **View Mode:**
        *   **Card Header Section:** A horizontal stack (`Stack direction="row"`) with space-between alignment:
            *   Left: A horizontal stack containing a `BookmarkIcon` (color primary) and a `Typography` title (variant `subtitle1`, bold, text truncation).
            *   Right: A horizontal stack of action icon buttons:
                *   **Edit Button:** MUI `IconButton` with `aria-label="Edit Snippet"`, size `small`, showing `EditIcon`. Hover color: `primary.main`.
                *   **Delete Button:** MUI `IconButton` with `aria-label="Delete Snippet"`, size `small`, showing `DeleteIcon` or a small loader if deleting. Hover color: `error.main`.
        *   **Card Content Section:**
            *   MUI `Typography` (variant `body2`, color `text.secondary`, multi-line, scrollable, max-height `100px`, `sx={{ whiteSpace: 'pre-wrap', overflowY: 'auto' }}`).

### D. The Container: `TemplateManager.tsx`
Orchestrates the entire feature:
*   **Header Section:**
    *   MUI `Typography` (variant `h6`, bold, text color `text.primary`).
*   **Search Box:**
    *   MUI `TextField` with `placeholder="Search snippets..."`, `fullWidth`, `variant="outlined"`, `size="small"`, `sx={{ mb: 2 }}`.
    *   Uses `InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}` to integrate the search icon.
*   **Template Grid:**
    *   Renders a grid of cards: standard MUI responsive grid layout (`Grid` container with columns).
    *   Maps over `filteredTemplates` rendering `<TemplateListItem />`.
*   **States:**
    *   **Loading State:** Shows a skeleton grid of standard cards (`Grid` mapping to 3-6 card `Skeletons`).
    *   **Empty State:** If templates is empty, displays the friendly empty container. If no filtered results, displays the search empty container with a reset button.
