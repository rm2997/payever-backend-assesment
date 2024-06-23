import { MailerService } from '@nestjs-modules/mailer';
export async function sendAnEmail(
  mailerService: MailerService,
  fromEmail: string,
  toEmail: string,
  subject: string,
  message: string,
) {
  try {
    await mailerService.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: subject,
      text: message,
    });
  } catch (error) {
    console.log(error);
  }
}
