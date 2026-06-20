
## [2026-06-20 11:24:37] Verdict: APPROVED
# Technical Blueprint & Test Specification: TemplateManager Refactoring (Ticket #669)

## 1. Socratic Interrogation & Benchmarking Log

*   **Feasibility:** The proposed refactoring is highly feasible. The codebase uses Next.js 15, React 19, and Material UI (MUI). Splitting the monolithic component into a custom hook and isolated functional components is standard practice.
*   **Strategic Alignment:** The refactoring directly aligns with the `100-Line Modularity` and `TypeScript Zero-Any` standards defined in `CORE.md` and `AGENTS.md`. It separates the template management logic from presentation.
*   **Architectural Integrity:** The architectural strategy uses the Single Responsibility Principle:
    *   `useTemplateManager.ts` is the sole custodian of the state and API calls.
    *   `TemplateForm.tsx` handles form fields and inputs.
    *   `TemplateListItem.tsx` renders individual cards.
    *   `TemplateManager.tsx` aggregates the sub-components and organizes the main layout.
*   **Necessity/Priority:** Essential to resolve the ESLint warning/error for the legacy `TemplateManager.tsx` which currently requires `/* eslint-disable max-lines */`.
*   **External Dependencies & Cost:** No new external dependencies are introduced. Standard `@mui/material` elements and `@mui/icons-material` icons will be used.

---

## 2. Technical Blueprint

### File 1: `src/hooks/useTemplateManager.ts`
*   **Path:** `src/hooks/useTemplateManager.ts`
*   **Modularity Verification:** ~77 lines (Fits within the 100-line rule).
*   **Imports:**
    ```typescript
    import { useState, useEffect, useMemo } from 'react';
    import { getMetadataTemplates, deleteMetadataTemplate, updateMetadataTemplate } from '@/app/actions/metadata';
    ```
*   **TypeScript Types & Interface:**
    ```typescript
    export interface Template {
      id: string;
      name: string;
      content: string;
    }
    ```
*   **Implementation Outline:**
    ```typescript
    export function useTemplateManager() {
      const [templates, setTemplates] = useState<Template[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [deletingId, setDeletingId] = useState<string | null>(null);
      const [searchQuery, setSearchQuery] = useState('');
      const [editingId, setEditingId] = useState<string | null>(null);
      const [editName, setEditName] = useState('');
      const [editContent, setEditContent] = useState('');
      const [isUpdating, setIsUpdating] = useState(false);

      const filteredTemplates = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return templates.filter(t => t.name.toLowerCase().includes(q) || t.content.toLowerCase().includes(q));
      }, [templates, searchQuery]);

      const fetchTemplates = async () => {
        try {
          setTemplates((await getMetadataTemplates()) as Template[]);
        } catch (e) {
          console.error('Failed to fetch templates:', e);
        } finally {
          setIsLoading(false);
        }
      };

      useEffect(() => { fetchTemplates(); }, []);

      const handleStartEdit = (t: Template) => {
        setEditingId(t.id);
        setEditName(t.name);
        setEditContent(t.content);
      };

      const handleCancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditContent('');
      };

      const handleUpdate = async (id: string) => {
        if (!editName.trim() || !editContent.trim()) return;
        setIsUpdating(true);
        try {
          const updated = await updateMetadataTemplate(id, { name: editName, content: editContent });
          setTemplates(prev => prev.map(t => t.id === id ? (updated as Template) : t));
          handleCancelEdit();
        } catch (e) {
          console.error(e);
          alert('Failed to update template.');
        } finally {
          setIsUpdating(false);
        }
      };

      const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this snippet?')) return;
        setDeletingId(id);
        try {
          await deleteMetadataTemplate(id);
          setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (e) {
          console.error(e);
          alert('Failed to delete template.');
        } finally {
          setDeletingId(null);
        }
      };

      return {
        templates, filteredTemplates, isLoading, deletingId, searchQuery, setSearchQuery,
        editingId, editName, editContent, setEditName, setEditContent, isUpdating,
        handleStartEdit, handleCancelEdit, handleUpdate, handleDelete, fetchTemplates
      };
    }
    ```

### File 2: `src/components/settings/TemplateForm.tsx`
*   **Path:** `src/components/settings/TemplateForm.tsx`
*   **Modularity Verification:** ~55 lines (Fits within the 100-line rule).
*   **Imports:**
    ```typescript
    import React from 'react';
    import { TextField, Button, Box, Stack, CircularProgress } from '@mui/material';
    import CheckIcon from '@mui/icons-material/Check';
    ```
*   **Props Interface:**
    ```typescript
    export interface TemplateFormProps {
      name: string;
      content: string;
      isUpdating: boolean;
      onNameChange: (val: string) => void;
      onContentChange: (val: string) => void;
      onSave: () => void;
      onCancel: () => void;
    }
    ```
*   **Implementation Spec:**
    Renders two `TextField` components (name and content) with built-in validation feedback.
    Name field MUST have `placeholder="Name"` so that E2E selectors `input[placeholder="Name"]` continue to match.
    Save button MUST render text `"Save"` to match `button:has-text("Save")`.

### File 3: `src/components/settings/TemplateListItem.tsx`
*   **Path:** `src/components/settings/TemplateListItem.tsx`
*   **Modularity Verification:** ~85 lines (Fits within the 100-line rule).
*   **Imports:**
    ```typescript
    import React from 'react';
    import { Card, Box, Typography, IconButton, CircularProgress } from '@mui/material';
    import BookmarkIcon from '@mui/icons-material/Bookmark';
    import EditIcon from '@mui/icons-material/Edit';
    import DeleteIcon from '@mui/icons-material/Delete';
    import { Template } from '@/hooks/useTemplateManager';
    import { TemplateForm } from './TemplateForm';
    ```
*   **Props Interface:**
    ```typescript
    export interface TemplateListItemProps {
      template: Template;
      editingId: string | null;
      isUpdating: boolean;
      deletingId: string | null;
      editName: string;
      editContent: string;
      setEditName: (val: string) => void;
      setEditContent: (val: string) => void;
      onStartEdit: (t: Template) => void;
      onCancelEdit: () => void;
      onUpdate: (id: string) => void;
      onDelete: (id: string) => void;
    }
    ```
*   **Implementation Spec:**
    Renders outer `<Card data-testid="template-card" variant="outlined" ...>`.
    Edit button MUST contain `aria-label="Edit Snippet"`.
    Delete button MUST contain `aria-label="Delete Snippet"`.
    In edit mode, embeds `<TemplateForm ... />`.
    In view mode, renders the snippet name and snippet content inside a scrollable Box/Typography.

### File 4: `src/components/settings/TemplateManager.tsx`
*   **Path:** `src/components/settings/TemplateManager.tsx`
*   **Modularity Verification:** ~80 lines (Fits within the 100-line rule).
*   **Imports:**
    ```typescript
    'use client';
    import React from 'react';
    import { Box, Typography, TextField, InputAdornment, Skeleton, Button } from '@mui/material';
    import SearchIcon from '@mui/icons-material/Search';
    import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
    import { useTemplateManager } from '@/hooks/useTemplateManager';
    import { TemplateListItem } from './TemplateListItem';
    ```
*   **Implementation Spec:**
    Consumes `useTemplateManager()`.
    Renders search input (`TextField` with `SearchIcon` startAdornment).
    Renders the responsive grid using `Box` styled with CSS Grid:
    `sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}`.
    Handles Empty and Loading states (using MUI Skeletons).

---

## 3. Test Specification

### Automated Tests
1.  **Playwright E2E settings.spec.ts & snippets.spec.ts:**
    *   Verify that `settings.spec.ts` continues to pass entirely.
    *   Verify that `snippets.spec.ts` continues to pass entirely.
    *   Ensure selectors: `data-testid="template-card"`, `aria-label="Edit Snippet"`, `aria-label="Delete Snippet"`, `input[placeholder="Name"]`, and `button:has-text("Save")` remain functional.
    *   Verify native browser window `confirm` dialog is used during delete.
2.  **Unit / Integration Tests:**
    *   Test server actions in `src/app/actions/metadata.ts` for correctness (creating, updating, deleting, and fetching).
    *   Test custom hook `useTemplateManager.ts` by mock-rendering or using React Testing Library to verify CRUD state transitions.

### Manual Verification Script
Perform the following verification steps on the local server (`http://localhost:3000`):
1.  **Navigation:**
    *   Go to `/settings`.
    *   Click the "Snippets" tab.
    *   Verify the URL updates to `/settings?tab=snippets`.
2.  **Search Filtering:**
    *   Enter a query into the Search box.
    *   Verify that snippets are filtered instantly.
    *   If no match is found, verify that the empty state "No matching snippets found for '<query>'" and "Clear Search" button are shown.
3.  **Edit Snippet:**
    *   Click the "Edit" (pencil) icon on any template card.
    *   Verify the card switches to edit form mode.
    *   Edit the name and content. If you clear the fields, verify helper texts are shown and the save button is disabled.
    *   Click "Save". Verify the card returns to view mode and shows the updated details.
4.  **Delete Snippet:**
    *   Click the "Delete" (trash) icon.
    *   Verify browser confirm dialog appears.
    *   Accept the dialog. Verify that the snippet card is removed immediately from the page.

