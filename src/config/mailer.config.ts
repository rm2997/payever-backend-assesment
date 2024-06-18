import { MailerOptions } from '@nestjs-modules/mailer';

export default (): MailerOptions => ({
  transport: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: false,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  },
  defaults: {
    from: `"No Reply" <${process.env.MAILER_USER}>`,
  },
});
