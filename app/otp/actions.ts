"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OTP_MAX_ATTEMPTS, verifyOtpHash } from "@/lib/otp";
import { createSession } from "@/lib/session";

export async function verifyOtp(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const code = formData.getAll("code").join("");

    if (!email || code.length !== 6) {
        redirect(`/otp?email=${encodeURIComponent(email)}&error=Enter+the+full+code`);
    }

    const otp = await prisma.otp.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" }
    });

    if (!otp || otp.expiresAt < new Date() || otp.attempts >= OTP_MAX_ATTEMPTS) {
        redirect(`/otp?email=${encodeURIComponent(email)}&error=Code+expired.+Request+a+new+one.`);
    }

    if (!verifyOtpHash(code, otp.codeHash)) {
        await prisma.otp.update({
            where: { id: otp.id },
            data: { attempts: { increment: 1 } }
        });
        redirect(`/otp?email=${encodeURIComponent(email)}&error=Invalid+code`);
    }

    await prisma.otp.deleteMany({ where: { email } });

    const existing = await prisma.user.findUnique({ where: { email } });
    const user = existing ?? await prisma.user.create({ data: { email } });
    await createSession(user.id);

    if (!user.username) {
        redirect("/onboarding");
    }
    redirect("/");
}
