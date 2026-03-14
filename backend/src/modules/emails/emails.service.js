import { prisma } from "../../config/prisma.js";
import { sendBulkEmail } from "../../services/email.service.js";

export const createBulkEmailCampaign = async ({ senderId, recipients, subject, body }) => {
  const sendResult = await sendBulkEmail({
    recipients,
    subject,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6">${body}</div>`
  });

  const campaign = await prisma.emailCampaign.create({
    data: {
      senderId,
      recipients,
      subject,
      body
    }
  });

  return { campaign, sendResult };
};
