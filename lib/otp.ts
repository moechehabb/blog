import { createHash, randomInt, timingSafeEqual } from "crypto";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

export function generateOtp() {
    return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(code: string) {
    return createHash("sha256").update(code).digest("hex");
}

export function verifyOtpHash(code: string, codeHash: string) {
    const a = Buffer.from(hashOtp(code));
    const b = Buffer.from(codeHash);
    return a.length === b.length && timingSafeEqual(a, b);
}
