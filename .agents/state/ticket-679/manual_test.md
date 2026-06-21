# Manual QA Script: Settings Support Page Enhancement

## Prerequisites
1. User must be authenticated and logged into the application.
2. Navigate to `/settings?tab=support`.

## Test Scenarios

### Scenario 1: Verify Authenticated User Email Display
- **Action**: View the contact form on the Support page.
- **Expected Result**: The authenticated user's email address is displayed in a non-editable, subtle typography element.

### Scenario 2: Verify Client-Side Validation
- **Action**: 
  1. Attempt to submit the form with an empty message.
  2. Attempt to submit the form with a message exceeding 1000 characters.
- **Expected Result**: The submit button is disabled. A validation error may appear.

### Scenario 3: Verify Successful Submission
- **Action**: Fill the `topic` and `message` (10-1000 characters) and submit the form.
- **Expected Result**: The UI swaps in-place to a success state card featuring the `CheckCircleOutlineIcon` without emojis.

### Scenario 4: Verify Rate Limiting
- **Action**: Attempt to submit multiple rapid support requests consecutively.
- **Expected Result**: The application prevents spam submissions and returns an appropriate error or rate-limit message.
