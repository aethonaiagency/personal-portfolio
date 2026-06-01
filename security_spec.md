# Security Specification for Portfolio Database

## 1. Data Invariants
- **Bookings**: A booking must have a valid `name` (string up to 100 chars), a valid `email` (string up to 100 chars), a `date` (string up to 50 chars), and a `time` (string up to 50 chars). The state `status` must be one of `New`, `Confirmed`, `Completed`, `Cancelled`.
- **Leads**: A lead must have a valid `name` (string up to 100 chars), `email` (string up to 100 chars), a `budget` (string up to 50 chars), and a `message` (string up to 1000 chars). The state `status` must be one of `unread`, `read`, `archived`.
- **Settings**: Modifiable settings are stored in `/settings/global`.

## 2. Payload Validation Cases
- Test cases are implemented in the API validator blocks to reject malicious over-sized payloads or unauthorized values.
