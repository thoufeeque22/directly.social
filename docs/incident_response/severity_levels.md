# Severity Levels

This document defines the severity levels (P1-P4) for incidents, along with the expected response times and communication cadences.

## P1: Critical Outage

**Definition:** The core service is completely unavailable, or a critical feature is broken for all users, resulting in significant business impact. Data loss or a severe security breach is occurring.
**Examples:**
- The main website is down (5xx errors).
- Users cannot log in.
- The database is corrupted or inaccessible.

**Response Expectations:**
- **Target Response Time:** Immediate (within 15 minutes).
- **Target Resolution Time:** As quickly as possible. Drop all other work.
- **Communication Cadence:** Initial update within 15 minutes of detection. Subsequent updates every 30-60 minutes.
- **Post-Mortem Required:** Yes.

## P2: Major Degradation

**Definition:** The service is available, but a core feature is significantly degraded or broken for a large subset of users. There is a noticeable negative impact on the user experience.
**Examples:**
- A secondary but important feature (e.g., specific API endpoints, a major integration) is failing.
- Significant latency or performance degradation across the platform.

**Response Expectations:**
- **Target Response Time:** Within 1 hour (during business hours) / ASAP off-hours.
- **Target Resolution Time:** Same day.
- **Communication Cadence:** Initial update within 1 hour. Subsequent updates every 1-2 hours.
- **Post-Mortem Required:** Yes, highly recommended.

## P3: Minor Issue / Partial Degradation

**Definition:** A non-core feature is broken, or the issue affects a small percentage of users. The core functionality of the platform remains intact.
**Examples:**
- A minor UI bug that prevents a non-critical action.
- A specific, low-traffic page is throwing an error.
- Delayed processing of background jobs that doesn't immediately affect the user experience.

**Response Expectations:**
- **Target Response Time:** Within 1 business day.
- **Target Resolution Time:** Addressed in the next sprint or deployment cycle.
- **Communication Cadence:** Update on the specific issue thread or support ticket. Status page update generally not required unless it becomes a P2.
- **Post-Mortem Required:** No.

## P4: Trivial / Cosmetic

**Definition:** A very minor issue that does not affect functionality or the core user experience.
**Examples:**
- A typo in documentation or a minor UI misalignment.
- A feature request or enhancement.

**Response Expectations:**
- **Target Response Time:** Triage within standard backlog grooming.
- **Target Resolution Time:** Added to the backlog for future prioritization.
- **Communication Cadence:** Standard release notes.
- **Post-Mortem Required:** No.
