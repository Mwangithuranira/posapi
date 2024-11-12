import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

export const sendEmail = async (email: string, subject: string, userName: string, message: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `${subject}`,
            text: message,
            html: html
        };

        const mailRes = await transporter.sendMail(mailOptions);
        console.log('mailRes', mailRes);

        let mailResponse: string = '';
        if (mailRes.accepted.length > 0) {
            mailResponse = 'Email sent successfully';
        } else if (mailRes.rejected.length > 0) {
            mailResponse = 'Email not sent';
        } else {
            mailResponse = 'Email server error';
        }
        return mailResponse;
    } catch (error: any) {
        return JSON.stringify(error.message, null, 500);
    }
};

export const sendRegistrationEmailTemplate = async (userEmail: string, eventName: string, UserName: string): Promise<string> => {
    try {
        const templatePath = path.join(__dirname, './emailTemplate.ejs');
        const html: string = await ejs.renderFile(templatePath, { UserName, eventName });

        const subject: string = `Confirmation: You have ${eventName}`;
        const message: string = `Hello 👋🏻 ${UserName}, we hope you enjoy our services. Thank you for choosing us.`;

        const mailRes: string = await sendEmail(userEmail, subject, UserName, message, html);
        return mailRes;
    } catch (error: any) {
        return JSON.stringify(error.message, null, 500);
    }
};
