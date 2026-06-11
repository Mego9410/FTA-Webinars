import "server-only";

import { Resend } from "resend";

export type ReminderType = "1h" | "15m" | "live";

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatSessionTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date(iso));
}

type EmailLayoutParams = {
  eyebrow: string;
  title: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  unsubscribeUrl: string;
};

function emailLayout(params: EmailLayoutParams): string {
  const { eyebrow, title, bodyHtml, ctaLabel, ctaUrl, unsubscribeUrl } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F3;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#5E5E5A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 10px 28px rgba(15,15,10,.08);">
          <tr>
            <td style="background:#E4AD25;padding:20px 28px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#0F0F0A;">Frank Taylor &amp; Associates</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#B4862A;">${escapeHtml(eyebrow)}</p>
              <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;font-weight:800;color:#1A1A17;letter-spacing:-0.02em;">${escapeHtml(title)}</h1>
              ${bodyHtml}
              <a href="${ctaUrl}" style="display:inline-block;margin-top:24px;background:#E4AD25;color:#0F0F0A;font-weight:700;font-size:15px;text-decoration:none;padding:14px 22px;border-radius:16px;">
                ${escapeHtml(ctaLabel)}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#8C8C88;">
                <a href="${unsubscribeUrl}" style="color:#B4862A;font-weight:600;text-decoration:none;">Unsubscribe</a>
                from webinar emails.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#8C8C88;">Frank Taylor &amp; Associates · Confidential seller-first advice since 1990</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function bodyParagraph(text: string): string {
  return `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#5E5E5A;">${text}</p>`;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  const from = process.env.EMAIL_FROM;
  const resend = getResendClient();

  if (!resend || !from) {
    return { ok: false, error: "Email is not configured (RESEND_API_KEY / EMAIL_FROM)" };
  }

  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data?.id) {
    return { ok: false, error: "Resend did not return a message id" };
  }

  return { ok: true, id: data.id };
}

export async function sendWelcomeEmail(params: {
  to: string;
  name: string;
  userId: string;
}): Promise<SendEmailResult> {
  const appUrl = getAppUrl().replace(/\/$/, "");

  return sendEmail({
    to: params.to,
    subject: "Welcome to FTA webinars",
    html: emailLayout({
      eyebrow: "Webinars",
      title: `Welcome, ${params.name}`,
      bodyHtml: [
        bodyParagraph(
          "Thank you for registering. You are booked in for our next expert webinar for dental practice owners.",
        ),
        bodyParagraph(
          "We will send you a reminder before we go live. When the session starts, join from the link below to watch at the live position — no login required.",
        ),
      ].join(""),
      ctaLabel: "Go to the webinar room →",
      ctaUrl: `${appUrl}/webinar`,
      unsubscribeUrl: `${appUrl}/unsubscribe?u=${params.userId}`,
    }),
  });
}

export async function sendReminderEmail(params: {
  to: string;
  name: string;
  userId: string;
  sessionTopic: string;
  sessionStartTime: string;
  hostName: string;
  type: ReminderType;
}): Promise<SendEmailResult> {
  const appUrl = getAppUrl().replace(/\/$/, "");
  const formattedTime = formatSessionTime(params.sessionStartTime);
  const unsubscribeUrl = `${appUrl}/unsubscribe?u=${params.userId}`;
  const joinUrl = `${appUrl}/webinar`;

  const copy = {
    "1h": {
      subject: "Your webinar starts in 1 hour",
      eyebrow: "Reminder",
      title: "Your webinar starts soon",
      lead: `Hi ${escapeHtml(params.name)}, your FTA webinar begins in about one hour.`,
      cta: "Join the webinar →",
    },
    "15m": {
      subject: "Your webinar starts in 15 minutes",
      eyebrow: "Reminder",
      title: "Your webinar starts soon",
      lead: `Hi ${escapeHtml(params.name)}, your FTA webinar begins in about 15 minutes.`,
      cta: "Join the webinar →",
    },
    live: {
      subject: "We're live now",
      eyebrow: "Live now",
      title: "We're live",
      lead: `Hi ${escapeHtml(params.name)}, we have just gone live.`,
      cta: "Join the live session →",
    },
  }[params.type];

  const bodyHtml = [
    bodyParagraph(copy.lead),
    bodyParagraph(
      `<strong style="color:#1A1A17;">${escapeHtml(params.sessionTopic)}</strong><br />Hosted by ${escapeHtml(params.hostName)}<br />${escapeHtml(formattedTime)}`,
    ),
    bodyParagraph("Join from the link below — no login required."),
  ].join("");

  return sendEmail({
    to: params.to,
    subject: copy.subject,
    html: emailLayout({
      eyebrow: copy.eyebrow,
      title: copy.title,
      bodyHtml,
      ctaLabel: copy.cta,
      ctaUrl: joinUrl,
      unsubscribeUrl,
    }),
  });
}
