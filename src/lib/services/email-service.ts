import { EmailOptions } from '../billing/types';
import { ConsoleEmailProvider, EmailProvider, ResendEmailProvider } from './email-provider';

export class EmailService {
  private provider: EmailProvider;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.provider = apiKey ? new ResendEmailProvider(apiKey) : new ConsoleEmailProvider();
  }

  async sendAdminEmail(options: EmailOptions) {
    try {
      await this.provider.send(options);
    } catch (error) {
      console.error('[EmailService] Failed to send email:', error);
    }
  }
}

const emailService = new EmailService();
export const sendAdminEmail = (options: EmailOptions) => emailService.sendAdminEmail(options);
