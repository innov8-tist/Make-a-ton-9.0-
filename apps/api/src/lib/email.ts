import { Resend } from 'resend';
import { env } from '../config/env.js';
import { logger } from './logger.js';

const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: env.FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      logger.error({ error, to, subject }, 'Failed to send email via Resend');
      throw new Error(`Failed to send email: ${error.message}`);
    }

    logger.info({ emailId: data?.id, to, subject }, 'Email sent successfully');
  } catch (error) {
    logger.error({ error, to, subject }, 'Error sending email');
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">
                    Reset Your Password
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #4a4a4a;">
                    Hello,
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #4a4a4a;">
                    We received a request to reset your password. Click the button below to create a new password:
                  </p>
                  
                  <!-- Button -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 500;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 20px; color: #2563eb; word-break: break-all;">
                    ${resetUrl}
                  </p>
                  
                  <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                    <strong>Important:</strong> This link will expire in 1 hour for security reasons.
                  </p>
                  
                  <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af; text-align: center;">
                    This is an automated email. Please do not reply to this message.
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 18px; color: #9ca3af; text-align: center;">
                    © ${new Date().getFullYear()} ${env.COMPANY_NAME}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    html,
  });
}

export async function sendPasswordChangedEmail(email: string, name: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed Successfully</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">
                    Password Changed Successfully ✓
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #4a4a4a;">
                    Hi ${name},
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #4a4a4a;">
                    This is a confirmation that your password has been changed successfully.
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #4a4a4a;">
                    If you made this change, no further action is required.
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #ef4444; font-weight: 500;">
                    ⚠️ If you did not make this change, please contact our support team immediately.
                  </p>
                  
                  <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                    <strong>Security Tip:</strong> Always use a strong, unique password and enable two-factor authentication when available.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; line-height: 18px; color: #9ca3af; text-align: center;">
                    This is an automated email. Please do not reply to this message.
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 18px; color: #9ca3af; text-align: center;">
                    © ${new Date().getFullYear()} ${env.COMPANY_NAME}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Changed Successfully',
    html,
  });
}
