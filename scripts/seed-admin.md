/**
 * One-time script to create the admin account.
 *
 * Prerequisites:
 *   1. base44 secrets set ADMIN_SETUP_KEY=... ADMIN_EMAIL=admin@raunhapho.vn ADMIN_PASSWORD=...
 *   2. Deploy functions: base44 functions deploy seedAdmin
 *
 * Usage (replace APP_ID and SETUP_KEY):
 *   curl -X POST "http://localhost:5173/api/functions/seedAdmin?app_id=APP_ID" \
 *     -H "Content-Type: application/json" \
 *     -H "X-Setup-Key: YOUR_SETUP_KEY"
 */
