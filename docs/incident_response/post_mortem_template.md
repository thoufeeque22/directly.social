# Post-Mortem Template

**Goal:** The purpose of this document is to learn from an incident, not to assign blame. Focus on systemic failures and how to prevent them in the future.

## Incident Summary

*   **Incident Name/ID:** (e.g., 2026-07-05 Database Outage)
*   **Date:** [YYYY-MM-DD]
*   **Author(s):** [Your Name]
*   **Status:** [Draft / Under Review / Completed]
*   **Severity:** [P1/P2/etc.]

## 1. Executive Summary

Provide a brief, high-level summary of the incident (1-2 paragraphs). What happened, how long did it last, and what was the impact on users?

## 2. Impact Assessment

*   **Duration:** How long was the system impacted? (Start time to End time)
*   **User Impact:** Approximately how many users were affected? Did they experience a complete outage, degraded performance, or data loss?
*   **Business Impact:** (Optional) Were there financial or reputational consequences?

## 3. Timeline of Events

List the chronological sequence of events. Include timestamps.

*   `00:00 UTC`: (Example) First monitoring alert triggered.
*   `00:05 UTC`: Issue verified and categorized as P1.
*   `00:10 UTC`: Initial status page updated.
*   `00:25 UTC`: Root cause identified (describe briefly).
*   `00:45 UTC`: Mitigation applied.
*   `01:00 UTC`: System stable; monitoring phase begins.
*   `01:30 UTC`: Incident marked as resolved.

## 4. Root Cause Analysis (The "5 Whys")

Ask "Why?" repeatedly to drill down to the fundamental cause of the incident.

1.  **Why did the system go down?** Because the database ran out of connections.
2.  **Why did it run out of connections?** Because a new query introduced in the last deployment wasn't releasing connections properly.
3.  **Why wasn't the query releasing connections?** Because a specific error handling block was missing the `close()` statement.
4.  **Why wasn't this caught in testing?** Because our test suite didn't simulate the specific error condition that triggered the missing block.
5.  **Why wasn't the error condition simulated?** (Root Cause): We lack adequate negative testing coverage for this specific module.

## 5. What Went Well

*   What parts of our response process worked effectively? (e.g., Monitoring alerted us quickly; communication was timely).

## 6. What Could Be Improved

*   What challenges did we face during the response? (e.g., It took too long to find the bad query; logs were hard to parse).

## 7. Action Items (Preventative Measures)

List specific, actionable tasks to prevent recurrence or improve response time. Assign a priority and timeframe for each.

| Priority | Action Item | Assignee | Ticket/Issue Link |
| :--- | :--- | :--- | :--- |
| High | Add negative test cases for database connection handling. | [Name] | #123 |
| Medium | Set up an alert for when DB connections reach 80% capacity. | [Name] | #124 |
| Low | Update the logging format for better readability. | [Name] | #125 |
