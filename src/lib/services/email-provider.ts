import { Resend } from 'resend';
import { EmailOptions } from '../billing/types';
import { CONTACT_EMAILS } from '../core/emails';
import { BRAND } from '../core/brand';

export interface EmailProvider {
  send(options: EmailOptions): Promise<void>;
}

export class ResendEmailProvider implements EmailProvider {
  private client: Resend;
  constructor(apiKey: string) { this.client = new Resend(apiKey); }

  async send(options: EmailOptions) {
    const adminEmail = process.env.ADMIN_EMAIL || CONTACT_EMAILS.admin;
    await this.client.emails.send({
      from: `${BRAND.name} <${CONTACT_EMAILS.alerts}>`,
      to: options.to || adminEmail,
      subject: options.subject,
      html: options.html,
    });
  }
}

export class ConsoleEmailProvider implements EmailProvider {
  async send(options: EmailOptions) {
    console.log(`[Email] Subject: ${options.subject}\nBody: ${options.html}`);
  }
}
