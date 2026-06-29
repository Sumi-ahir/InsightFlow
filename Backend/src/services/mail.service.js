import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("EMAIL FUNCTION CALLED");

    const info = await transporter.sendMail({
      from: `"InsightFlow AI" <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email Sent Successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};