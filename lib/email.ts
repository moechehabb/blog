import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// EMAIL_FROM must be a sender on a domain verified in Resend.
// "onboarding@resend.dev" works for testing but only delivers to your own account's email.
const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

export async function sendOtpEmail(email: string, code: string) {
    const { error } = await resend.emails.send({
        from,
        to: email,
        subject: `${code} is your login code`,
        text: `Your login code is ${code}. It expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`,
    });
    if (error) {
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
}
