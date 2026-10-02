import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function createTransport() {
  if (!env.smtp.user || !env.smtp.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
}

export async function sendContactNotification({
  name,
  email,
  message,
  createdAt,
}) {
  const transporter = createTransport();
  const date = new Date(createdAt).toLocaleString("en-GB", {
    timeZone: "Europe/Berlin",
  });
  const text = `Name:
${name}

Email:
${email}

Message:
${message}

Date:
${date}`;

  if (!transporter) {
    console.warn("[mail] SMTP is not configured. Contact email skipped.");
    console.info(text);
    return { skipped: true };
  }

  await transporter.sendMail({
    from: env.contactFrom,
    to: env.adminEmail,
    replyTo: email,
    subject: "New Contact Form Submission",
    text,
  });

  return { skipped: false };
}

export async function sendPurchaseEmail({
  to,
  name,
  productTitle,
  downloadUrl,
}) {
  const transporter = createTransport();
  const text = `Hi ${name},

Thank you for purchasing ${productTitle} from Kids Phonics Academy.

Your secure download link (valid for 7 days):
${downloadUrl}

Happy learning!
Kids Phonics Academy`;

  if (!transporter) {
    console.warn("[mail] SMTP is not configured. Purchase email skipped.");
    return { skipped: true };
  }

  await transporter.sendMail({
    from: env.contactFrom,
    to,
    subject: `Your ${productTitle} is ready`,
    text,
  });

  return { skipped: false };
}
