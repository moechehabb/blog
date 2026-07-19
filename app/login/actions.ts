"use server"
import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { generateOtp, hashOtp, OTP_TTL_MS } from "@/lib/otp";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    if (!email) {
        redirect("/login?error=Email+is+required");
    }

    // At most one code request per minute per email
    const recent = await prisma.otp.findFirst({
        where: {
            email,
            createdAt: { gt: new Date(Date.now() - 60 * 1000) }
        }
    });
    if (recent) {
        redirect(`/otp?email=${encodeURIComponent(email)}`);
    }

    const otp = generateOtp();

    await prisma.otp.deleteMany({ where: { email } });
    await prisma.otp.create({
        data: {
            email,
            codeHash: hashOtp(otp),
            expiresAt: new Date(Date.now() + OTP_TTL_MS)
        }
    });

    try {
        await sendOtpEmail(email, otp);
    } catch {
        redirect("/login?error=Failed+to+send+email");
    }

    redirect(`/otp?email=${encodeURIComponent(email)}`);
}
