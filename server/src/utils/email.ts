import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const smtpHost = process.env.SMTP_HOST;

  let transporter: nodemailer.Transporter;

  if (!smtpHost) {
    // nodemailer v7+ removed createTestAccount. Use a static Ethereal test account
    // or create one on first use via nodemailer.createTransport with ethereal config.
    // We generate a fresh Ethereal account using the newer API.
    const testAccount = await nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: '', pass: '' },
    } as any);

    // Use the createTestAccount helper if still available (v6), otherwise fall back
    // to a JSON transport that just logs the email content to the console.
    try {
      const account = await (nodemailer as any).createTestAccount?.();
      if (account) {
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: account.user, pass: account.pass },
        });
      } else {
        // nodemailer v7+: no test account helper — log to console instead
        transporter = nodemailer.createTransport({ jsonTransport: true } as any);
      }
    } catch {
      transporter = nodemailer.createTransport({ jsonTransport: true } as any);
    }
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
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
    if (typeof (nodemailer as any).getTestMessageUrl === 'function') {
      console.log('✉️  Message sent:', info.messageId);
      console.log('🔗 Preview URL:', (nodemailer as any).getTestMessageUrl(info));
    } else {
      // jsonTransport mode — info.message contains the serialized email
      console.log('✉️  Email (dev/console mode):', info.message ?? info.messageId);
      console.log('   To:', options.email);
      console.log('   Subject:', options.subject);
    }
  }
};
