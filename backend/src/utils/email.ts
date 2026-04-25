import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  // If no SMTP details are loaded in env, use Ethereal for local testing
  const smtpHost = process.env.SMTP_HOST;

  let transporter;

  if (!smtpHost) {
    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  } else {
    // If user sets up Tuta (requires Tutanota Desktop / bridge config) or SendGrid
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      // Note: Tuta native does not provide simple standard SMTP unless you use their paid "bridge" or integration.
    });
  }

  const message = {
    from: `${process.env.FROM_NAME || 'Library Admin'} <${process.env.FROM_EMAIL || 'admin@library.local'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  if (!smtpHost) {
    console.log('✉️ Message sent: %s', info.messageId);
    console.log('🔗 Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};
