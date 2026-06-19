# Original User Request

## 2026-06-20T00:05:08Z

Refactor the `AIChatbot.tsx` component into modular sub-components (`ChatMessageList`, `ChatMessageItem`, header, input area) and extract UI state management into a `useChatbotUI` hook to improve maintainability for production.

Working directory: /Users/thoufeeque/projects/social-studio-app
Integrity mode: benchmark

## Requirements

### R1. Component Modularization
Extract `src/components/chat/AIChatbot.tsx` into focused sub-components including `ChatMessageList`, `ChatMessageItem`, a header, and an input area component. Ensure consistent use of Material UI icons (e.g., AutoAwesome, SmartToy).

### R2. State Extraction
Move UI layout state management (drawer toggling, scroll management) into a new custom hook named `useChatbotUI`.

### R3. Strict Visual Preservation
The refactor must strictly preserve the existing UI pixel-for-pixel. There should be no visual or functional changes to the end user.

## Verification Resources
Use `npm run lint` and `npm run build` to verify the refactoring hasn't introduced type or compilation errors.

## Acceptance Criteria

### Verification
- [ ] `npm run lint` passes without new errors.
- [ ] `npm run build` completes successfully.
- [ ] The refactored components preserve the UI pixel-for-pixel with no visual changes.
- [ ] Code logic is successfully extracted into the required sub-components and `useChatbotUI` hook.
- [ ] `npm run test` pass 
