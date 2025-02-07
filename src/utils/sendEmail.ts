import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

let url = process.env.LOCAL_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationLink = `${url}/api/auth/verify/${token}`;

    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL as string,
        subject: "Verify Your Email",
        text: `Click the link to verify your email: ${verificationLink}`,
        html: `<p>Click the link to verify your email:</p><a href="${verificationLink}">Verify Email</a>`,
    };

    try {
        await sgMail.send(msg);
        console.log("Verification email sent!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
