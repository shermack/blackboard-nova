import sgMail from "@sendgrid/mail";
import { env } from "../config/env.js";

if (env.sendgridApiKey) {
  sgMail.setApiKey(env.sendgridApiKey);
}

export const sendBulkEmail = async ({ recipients, subject, html }) => {
  if (!env.sendgridApiKey) {
    return { mocked: true, recipientsCount: recipients.length };
  }

  await sgMail.sendMultiple({
    to: recipients,
    from: env.mailFrom,
    subject,
    html
  });

  return { mocked: false, recipientsCount: recipients.length };
};
