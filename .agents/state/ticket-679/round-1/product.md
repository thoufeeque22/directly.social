
## [2026-06-21 01:01:00] Verdict: APPROVED
# Product Specification: Settings Support Page Enhancement (Ticket 679)

**Verdict**: APPROVED
**Date**: 2026-06-21
**Author**: Senior Product Designer & UX Strategist

---

## 1. 🔍 Interrogation Log (Socratic Log)

This log details the critical design decisions made during the formulation of this feature and how open questions were resolved:

*   **Q1: How is the user's ID and contact details retrieved for the support submission?**
    *   *Resolution*: The `/settings?tab=support` page is accessed from the authenticated user dashboard. We will not ask the user for their name or email to reduce form friction and avoid spoofing. The Next.js Server Action will wrap the database transaction in `protectedAction(async (userId) => { ... })` which securely resolves the authenticated `userId` server-side via next-auth. We will display a subtle, non-editable typography element in the UI indicating the email address to which responses will be sent.
*   **Q2: What topics/categories are available for selection?**
    *   *Resolution*: A Select dropdown with 5 options:
        1. General Inquiry
        2. Bug Report
        3. Feature Request
        4. Billing
        5. Other
*   **Q3: What fields are required and what are their validation rules?**
    *   *Resolution*: Both `topic` and `message` are required fields. 
        *   `topic`: Must match one of the predefined dropdown values.
        *   `message`: Must be a string of minimum 10 characters and maximum 1000 characters to prevent empty/spam submissions.
*   **Q4: How should character limits be enforced and communicated?**
    *   *Resolution*: We will show a character counter (e.g. `0 / 1000`) below the text area. It should update in real-time as the user types. If the message exceeds 1000 characters, the text field will show an error state and the submit button will be disabled.
*   **Q5: What happens upon successful form submission?**
    *   *Resolution*: Instead of navigating away or triggering a transient alert/toast, the contact form fields will be replaced in-place inside the `GlassCard` with a dedicated success card. This card will contain a checkmark icon, a clear confirmation header, response timeline details, and a button to submit another request if needed.
*   **Q6: How will external support/docs links be validated?**
    *   *Resolution*: During the QA phase, we will implement an automated script/test to programmatically query all support and documentation links on the page using HTTP HEAD or GET requests. The verification fails if any link returns a status code other than 200.

---

## 2. 🚀 UX Strategy & Competitive Benchmarking

### Vercel Support Form
*   **Observations**: Vercel integrates its support form directly inside its dashboard. It identifies the authenticated user, workspace, and context automatically. It provides a dropdown for issue classification, a clear text field, and displays real-time suggestions from documentation based on the user's typing.
*   **Takeaway**: Eliminate redundant text inputs (such as email/name) and replace them with automated metadata matching. Maintain in-context form submission without full page transitions.

### Stripe Support Portal
*   **Observations**: Stripe offers a highly structured form within its authenticated dashboard. It lists clear topics and adapts downstream helper inputs based on the category selected. Submission results are immediate, displaying success checkmarks and explicit SLA times (e.g., "We usually reply within 24 hours").
*   **Takeaway**: State a clear SLA time on the success page (e.g. "We will respond to your registered email address within 24 hours") to set clear user expectations and reduce user anxiety.

---

## 3. 📋 Industry Standards

We follow these best practices for contact forms:
1.  **Context preservation**: Submit forms asynchronously (using Next.js Server Actions and React transition states) to avoid refreshing or navigating away from the Settings context.
2.  **Robust client-side & server-side validation**:
    *   *Client-side*: Prevent submit when the input is empty or too short (<10 characters) or too long (>1000 characters). Disable the submit button during submission to prevent double-submitting.
    *   *Server-side*: Validate the incoming payload shape using a Zod schema. Restrict access strictly to authenticated users.
3.  **Strict Accessibility (A11y)**:
    *   All inputs must have explicit labels linked via `htmlFor` / `id` properties.
    *   Helper texts and error statements must be programmatically associated with inputs via `aria-describedby`.
    *   Keyboard navigation must work seamlessly (Tab index, visible focus indicators).
4.  **No Emojis in UI**: To maintain professional aesthetic integrity, user-facing UI labels, helpers, and success messages must use Material UI (MUI) icons rather than system emojis.

---

## 4. 🎨 UI Layout & Accessibility Specification

The form will be placed inside the existing `Support & Help` settings card, replacing the current "Email Support" link/button section.

### Layout Spacing & Typography
*   **Card Container**: Existing `GlassCard` layout with `padding: '2rem'`.
*   **Form Section Title**: `Typography variant="h6"` (Contact Support) with `fontWeight: 600` and `mb: 2`.
*   **Form Spacing**: Inputs should be stacked vertically inside a `Box` with `gap: 2` (or `mb: 2` on individual elements).
*   **Typography Colors**: Use MUI theme-aware values: `text.primary` for headers/labels, `text.secondary` for description and helper text. Never hardcode hex values like `#FFF` or `#000`.

### Form Fields & Inputs
1.  **Logged-In Account Display**:
    *   A text label showing: `"Submitting request as: [User Email]"` using `Typography variant="body2"` and `color="text.secondary"`.
2.  **Topic Select (Dropdown)**:
    *   `FormControl` container with full width.
    *   `InputLabel` paired with `Select` using an ID (e.g., `id="support-topic-label"` and `labelId="support-topic-label"`).
    *   Helper text `FormHelperText` with `id="support-topic-helper"` providing description: `"Select the category that best matches your inquiry"`.
    *   Options:
        *   `General Inquiry`
        *   `Bug Report`
        *   `Feature Request`
        *   `Billing`
        *   `Other`
3.  **Message Area (Multiline TextField)**:
    *   `TextField` component with `multiline`, `rows={4}`, `fullWidth`.
    *   Label: `"Message"`.
    *   Required indicator.
    *   Associated character counter inside `FormHelperText` or right-aligned helper text showing: `"[current] / 1000 characters"`.
4.  **Submit Button**:
    *   MUI `Button` with `variant="contained"`, `color="primary"`.
    *   Text: `"Submit Request"`.
    *   Start icon: `SendIcon` from `@mui/icons-material`.
    *   Must show loading indicator or disable button during the async transition.

### Success State
When the form is submitted successfully, the form inputs are replaced in the DOM with a success card:
*   **Container**: `Box` with centering layout (`display: 'flex'`, `flexDirection: 'column'`, `alignItems: 'center'`, `textAlign: 'center'`, `py: 4`).
*   **Icon**: `CheckCircleOutlineIcon` from `@mui/icons-material` with `color="success"` and `sx={{ fontSize: 60, mb: 2 }}`.
*   **Title**: `Typography variant="h6"` with `fontWeight: 600`, `mb: 1` -> `"Support Request Received"`.
*   **Body**: `Typography variant="body2"` and `color="text.secondary"`, `mb: 3` -> `"Thank you for reaching out. We have successfully logged your request and our support team will respond to your registered email address within 24 hours."` (Strictly no emojis in UI).
*   **Action Button**: `Button` with `variant="outlined"` -> `"Submit Another Request"`. Clicking this resets the success state and restores the empty form fields.

### Error State
*   Validation errors (e.g., message empty or too short) must show inline below the input with `error` state (e.g., `error={true}` on `TextField` and `FormControl`).
*   Global errors (e.g., network failure, DB issue) should be displayed in a theme-aware alert component at the top of the form.

---

## 5. 🗄️ Database & Schema Requirements

A new model is required in the Prisma schema to store these submissions.

```prisma
model SupportRequest {
  id        String   @id @default(cuid())
  userId    String
  topic     String
  message   String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

And update the `User` model to relate to the support requests:

```prisma
model User {
  // ...
  supportRequests SupportRequest[]
}
```

---

## 6. 🧪 Link Validation Requirements

All documentation, FAQ, and external resources links on the settings/support tab page must be verified programmatically.
*   **Link Targets**:
    *   Any external resource links (e.g., help center, platform tutorials).
*   **Verification Strategy**:
    *   The QA testing script must crawl the rendered HTML of `/settings?tab=support` and identify all anchor (`<a>`) elements.
    *   For each URL, make an HTTP request.
    *   Assert that all links resolve with an HTTP status of `200 OK`.
