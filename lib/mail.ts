import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendVerificationEmail = (email: string, token: string) => {
  const url = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Dev Dairies - Verify your email",
    html: `
      <div style="max-width: 600px; margin: auto; border: 1px solid #dadce0; border-radius: 8px; padding: 20px; font-family: 'Google Sans', Roboto, Arial, sans-serif; color: #333;">
  <div style="border-bottom: 1px solid #dadce0; padding-bottom: 24px; text-align: center;">
    <svg version="1.1" viewBox="0 0 1563 1563" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <path transform="translate(728,266)" d="m0 0h1v389l-453 453h-1v-389z" fill="#32FE56"/>
      <path transform="translate(1286,456)" d="m0 0h1v389l-452 452h-1v-389z" fill="#32FE56"/>
      <path transform="translate(499,946)" d="m0 0 4 2 226 226v389l-7-6-416-416 2-4z" fill="#00BE63"/>
      <path transform="translate(834)" d="m0 0 7 6 416 416-2 4-191 191-4-2-226-226z" fill="#00BE63"/>
    </svg>
    <h2 style="font-size: 24px; color: #333; margin-top: 16px;">Welcome to Dev Diaries</h2>
  </div>
  <div style="padding-top: 20px; line-height: 1.5; text-align: center">
    <p style="font-size: 16px;">We're excited to have you join our community of developers sharing their experiences and innovations.</p>
    <p style="font-size: 16px;">Please <strong>verify your email</strong> address by clicking the link below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #1a73e8; color: #fff; text-decoration: none; border-radius: 4px;">Verify Email</a>
    </div>
    <p style="font-size: 16px;">The verification link will expire in 24 hours</p>
  </div>
  <br />
  <p style="font-size: 16px;">If you didn't create an account with <strong>Dev Diaries</strong>, please ignore this email.</p>
  <p style="font-size: 16px;">Thanks,<br>Dev Diaries Team</p>
</div>

    `,
    text: `
      Welcome to Dev Diaries!

      We're excited to have you join our community of developers sharing their experiences and innovations.

      Please verify your email address by clicking the link below:

      ${url}

      The verification link will expire in 24 hours.
      
      If you didn't create an account with Dev Diaries, please ignore this email.

      Thanks,
      Dev Diaries Team
    `,
  };
  return mailOptions;
};

export const sendPasswordResetEmail = (email: string, token: string) => {
  const url = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${token}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Dev Diaries - Reset your password",
    html: `
<div style="max-width: 600px; margin: auto; border: 1px solid #dadce0; border-radius: 8px; padding: 20px; font-family: 'Google Sans', Roboto, Arial, sans-serif; color: #333;">
  <div style="border-bottom: 1px solid #dadce0; padding-bottom: 24px; text-align: center;">
    <svg version="1.1" viewBox="0 0 1563 1563" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <path transform="translate(728,266)" d="m0 0h1v389l-453 453h-1v-389z" fill="#32FE56"/>
      <path transform="translate(1286,456)" d="m0 0h1v389l-452 452h-1v-389z" fill="#32FE56"/>
      <path transform="translate(499,946)" d="m0 0 4 2 226 226v389l-7-6-416-416 2-4z" fill="#00BE63"/>
      <path transform="translate(834)" d="m0 0 7 6 416 416-2 4-191 191-4-2-226-226z" fill="#00BE63"/>
    </svg>
    <h2 style="font-size: 24px; color: #333; margin-top: 16px;">Reset Your Password</h2>
  </div>
  <div style="padding-top: 20px; line-height: 1.5;">
    <p style="font-size: 16px;">Hello,</p>
    <p style="font-size: 16px;">We received a request to reset your password for your <strong>Dev Diaries</strong> account.</p>
    <p style="font-size: 16px;">Please <strong>reset your password</strong> by clicking the link below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #1a73e8; color: #fff; text-decoration: none; border-radius: 4px;">Reset Password</a>
    </div>
    <p style="font-size: 16px;">The password reset link will expire in 24 hours.</p>
  </div>
  <br />
  <p style="font-size: 16px;">If you didn't create an account with <strong>Dev Diaries</strong>, please ignore this email.</p>
  <p style="font-size: 16px;">Thanks,<br>Dev Diaries Team</p>
</div>

    `,
    text: `
Reset Your Password

Hello,

We received a request to reset your password for your Dev Diaries account.

Please reset your password by clicking the link below:

${url}

The password reset link will expire in 24 hours.

If you didn't request a password reset, please ignore this email.

Thanks,
The Dev Diaries Team

    `,
  };
  return mailOptions;
};

export const sendEmail = async (email: string, type: "verifyEmail" | "resetPassword", token: string) => {
  try {
    let mailOptions;
    if (type === "verifyEmail") {
      mailOptions = sendVerificationEmail(email, token);
    } else if (type === "resetPassword") {
      mailOptions = sendPasswordResetEmail(email, token);
    }

    if (mailOptions) {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } else {
      throw new Error("Invalid email type");
    }
  } catch (error: any) {
    return NextResponse.json({ error: `Error sending email: ${error.message}` }, { status: 500 });
  }
};
