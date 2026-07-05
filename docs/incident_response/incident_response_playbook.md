# Incident Response Playbook

This document outlines the standard operating procedure for responding to incidents and outages. As a solopreneur, you will act in all roles, but the framework is designed to scale as the team grows.

## 1. Detection & Triage

**Objective:** Quickly identify the issue and determine its impact.

- **Acknowledge Alerts:** Review monitoring alerts, customer support tickets, or direct user reports.
- **Initial Assessment:** Determine the scope of the issue. Is it affecting all users, a subset, or a specific feature?
- **Assign Severity:** Use the guidelines in `severity_levels.md` to classify the incident (P1-P4).

## 2. Mobilization & Roles

**Objective:** Establish the incident response structure. 

*Currently, as a solopreneur, you will assume all these responsibilities. As the team grows, these roles will be distributed.*

- **Incident Commander (IC):** Drives the incident to resolution. Responsible for decision-making and overall coordination.
- **Operations/Engineering Lead:** Investigates the root cause and implements fixes.
- **Communications Lead:** Manages all internal and external communication (status page, social media, emails).

## 3. Investigation & Mitigation

**Objective:** Stop the bleeding and restore service as quickly as possible.

- **Identify the Root Cause:** Use logs, metrics, and recent deployments to identify the source of the issue.
- **Implement Mitigation:** Apply a temporary fix, rollback a deployment, or increase resources to stabilize the system. 
  - *Note: A full fix might come later; priority is restoring service.*
- **Regular Updates:** The Communications Lead should provide regular updates based on the SLAs defined in `severity_levels.md`. Use `communication_templates.md`.

## 4. Resolution & Recovery

**Objective:** Confirm the system is stable and return to normal operations.

- **Verify Mitigation:** Ensure the applied fix has resolved the issue and the system is stable.
- **Monitor System:** Closely monitor the system for any recurring issues.
- **Declare Incident Resolved:** Once stable for a predetermined period (e.g., 30 minutes), declare the incident resolved.
- **Final Communication:** Send the final update to users indicating resolution.

## 5. Post-Incident Analysis

**Objective:** Learn from the incident to prevent recurrence.

- **Draft Post-Mortem:** Within 48 hours of resolution (for P1/P2 incidents), complete the `post_mortem_template.md`.
- **Review Action Items:** Identify and prioritize action items (e.g., improving monitoring, fixing the root cause permanently, updating documentation).
- **Update Playbook:** Refine this playbook based on lessons learned during the incident.
