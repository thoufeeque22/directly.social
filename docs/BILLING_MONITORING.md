# Billing & Cost Monitoring

The Directly application includes a centralized system for monitoring external API spending (e.g., Google AI Studio, OpenAI) and alerting administrators when budget thresholds are reached.

## Architecture

The system follows **Clean Architecture** principles to ensure that business logic is decoupled from specific API providers and notification channels.

### Core Components

1.  **`BillingService` (`src/lib/services/billing-service.ts`)**:
    *   Orchestrates the sync process across all registered providers.
    *   Determines the health status (`HEALTHY`, `WARNING`, `CRITICAL`) based on a `BillingThresholdPolicy`.
    *   Triggers alerts via the `IBillingNotificationService`.

2.  **`BillingProvider` (`src/lib/billing/types.ts`)**:
    *   An interface defining how to fetch monthly spend data.
    *   Implementations: `GoogleBillingProvider`, `MockBillingProvider`.

3.  **`BillingThresholdPolicy` (`src/lib/services/billing-service.ts`)**:
    *   Encapsulates logic for warning (80%) and critical (100%) thresholds.

4.  **`PrismaSystemBillingRepository` (`src/lib/billing/repository.ts`)**:
    *   Handles persistence of billing data and status updates in the `SystemBilling` table.

## Configuration

### Google Cloud (Gemini)

To enable real-time billing monitoring for Google Cloud APIs, you must:

1.  **Enable Billing Export**: In the GCP Console, export your billing data to a **BigQuery** dataset.
2.  **Service Account**: Create a Service Account with `Billing Account Viewer` and `BigQuery Data Viewer` roles.
3.  **Environment Variable**: Store the Service Account JSON key in `GOOGLE_BILLING_SERVICE_ACCOUNT`.

> **Note**: The current `GoogleBillingProvider` is an implementation shell. Real-time spend retrieval requires querying the BigQuery export table.

### Mocking (Development/QA)

You can simulate different spending scenarios without a real GCP connection:

1.  Set `GOOGLE_BILLING_MOCK_SPEND` to a numerical value (e.g., `9.50`).
2.  The `MockBillingProvider` will return this value during the next sync.

## Automation

The system is integrated into the background worker (`src/lib/worker/worker.ts`):
*   **Interval**: Syncs every 4 hours.
*   **Alerts**: Sends an email to the administrator if status is not `HEALTHY`.

## UI / UX

Administrators can monitor billing status on the **Admin Analytics** dashboard:
*   `BillingCard`: Shows current spend, threshold, and status.
*   `BillingAlertBanner`: Displays a sticky warning if any provider is in a `WARNING` or `CRITICAL` state.
