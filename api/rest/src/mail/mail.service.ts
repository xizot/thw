import { Injectable } from '@nestjs/common';
import { ServerClient } from 'postmark'

@Injectable()
export class MailService {
    private client;

    constructor() {
        this.client = new ServerClient(process.env.POSTMARK_API_TOKEN);
    }

    async sendEmail(from: string, to: string, subject: string, content: string) {
        const message = {
            From: from || process.env.MAIL_FROM,
            To: to,
            Subject: subject,
            TextBody: content,
        };
        return this.client.sendEmail(message);
    }
    async sendEmailWithTemplateAsync(to: string, templateId: number, templateModel: object) {
        return this.client.sendEmailWithTemplate({
            TemplateId: templateId,
            TemplateModel: templateModel,
            From: process.env.MAIL_FROM,
            To: to
        })
    }
}
