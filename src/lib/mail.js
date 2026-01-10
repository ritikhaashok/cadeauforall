// A small mail helper that supports SendGrid (preferred) and SMTP (nodemailer) as a fallback.
// Usage: set CONTACT_RECIPIENT_EMAIL and either SENDGRID_API_KEY, or SMTP_* env vars.

import fs from "fs";

export async function sendContactEmail({ to, subject, text, html, attachments = [] }) {
  // prefer SendGrid when available
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sg = await import('@sendgrid/mail');
      sg.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL || to,
        subject,
        text,
        html,
        attachments: (attachments || []).map((a) => ({
          content: a.content.toString('base64'),
          filename: a.filename,
          type: a.contentType || 'application/octet-stream',
          disposition: 'attachment',
        })),
      };

      await sg.send(msg);
      return { ok: true };
    } catch (err) {
      console.warn('SendGrid send error', err);
      // fallthrough to try SMTP
    }
  }

  // fallback: nodemailer with SMTP credentials
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
        attachments: (attachments || []).map((a) => ({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
        })),
      };

      const info = await transporter.sendMail(mailOptions);
      return { ok: true, info };
    } catch (err) {
      console.warn('SMTP send error', err);
      return { ok: false, error: err };
    }
  }

  console.warn('No mail provider configured (SENDGRID_API_KEY or SMTP_* required)');
  return { ok: false, error: 'No mail provider configured' };
}
