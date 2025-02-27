# Google Sheets Payment Entry Portal

## Overview
This web portal allows suppliers to update payment statuses directly, with real-time synchronization to Google Sheets. It eliminates manual data entry and provides a streamlined, mobile-optimized interface for quick updates.

## Features
- **Real-Time Google Sheets Sync** – All updates reflect instantly.
- **Supplier-Specific Access** – Unique links per supplier (No login required).
- **Mobile-Optimized UI** – Clean, minimal, and easy to navigate.
- **Editable Fields** – Suppliers can update payment status and amounts.
- **Read-Only Fields** – Payment mode and shop names remain uneditable.

## Tech Stack
- **Backend:** Flask (Python)
- **Frontend:** HTML, CSS (Minimal UI)
- **Database:** Google Sheets API (for live data sync)
- **Hosting:** Local or Cloud Deployment (Optional)

## Usage
- Suppliers receive a unique link to access their specific entry page.
- They can update **Payment Status** and **Amount Received**.
- The changes are synced instantly to Google Sheets.
- Read-only fields ensure data integrity.

## Security & Restrictions
- No authentication required (each supplier has a unique URL).
- Only payment-related fields are editable.
- Google Sheets API ensures safe and controlled data updates.

## Future Enhancements
- **Multi-User Role Management** – Admin dashboard for overview.
- **Analytics & Reporting** – Insights into payment trends.
- **Offline Mode** – Sync updates when reconnected.

## License
This project is for internal use. Not intended for public distribution.

## Contact
For any queries or feature requests, reach out at **ankithx7@gmail.com**.

