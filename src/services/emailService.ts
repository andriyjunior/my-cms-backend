import nodemailer from "nodemailer";

import "../configs/dotenv";
import { stringify } from "querystring";
import { log } from "../logs";

const EMAIL_SERVICE = process.env.EMAIL_SERVICE!;
const EMAIL = process.env.EMAIL!;
const EMAIL_PASSWORD = process.env.EMAIL_PASS!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

class EmailService {
  transporter: nodemailer.Transporter;
  service: string = EMAIL_SERVICE;
  from: string = EMAIL;
  auth = { user: EMAIL, pass: EMAIL_PASSWORD };
  frontendUrl = FRONTEND_URL;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: this.service,
      from: this.from,
      auth: {
        user: this.auth.user,
        pass: this.auth.pass,
      },
    });
  }

  async sendInvitationEmail(
    to: string,
    user: Record<string, string>
  ): Promise<void> {
    const invitationLink = `${this.frontendUrl}/register}`;
    log.debug({ invitationLink });
    try {
      const mailOptions = {
        from: this.from,
        to,
        subject: "Invitation to Join Organization",
        html: `<p>Click the following link to join the organization:</p><a href="${invitationLink}">${invitationLink}</a>`,
      };
      console.log(user.email, user.password);
      // await this.transporter.sendMail(mailOptions);
    } catch (error) {
      log.error("Error sending invitation email:", error);
      throw error;
    }
  }
}

export default new EmailService();
