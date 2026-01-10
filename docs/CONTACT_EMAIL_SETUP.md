Contact email setup

You can configure the app to send an email notification when someone submits the contact form.

1. Choose a provider

- SendGrid (recommended): set `SENDGRID_API_KEY` and `CONTACT_RECIPIENT_EMAIL` (optionally `SENDGRID_FROM_EMAIL`).
- SMTP (nodemailer fallback): set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_RECIPIENT_EMAIL`. Optionally set `SMTP_PORT` and `SMTP_FROM`.

2. Example `.env.local`

# SendGrid example

SENDGRID_API_KEY=SG_xxx
CONTACT_RECIPIENT_EMAIL=yourname@example.com
SENDGRID_FROM_EMAIL=notifications@example.com

# Or SMTP example

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=smtp-user
SMTP_PASS=super-secret
SMTP_FROM=notifications@example.com
CONTACT_RECIPIENT_EMAIL=yourname@example.com

3. Notes

- If the form included an image that was uploaded locally (to `public/uploads/`), the server will try to attach that image to the email.
- If you use Supabase storage and set it public, the email will include a public link to the image.
- After setting env vars, restart your dev server so Next.js picks them up.
