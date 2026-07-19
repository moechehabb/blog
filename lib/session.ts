import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import prisma from "./prisma";

const SESSION_COOKIE = "session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export async function createSession(userId: number) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await prisma.session.create({
        data: { id: token, userId, expiresAt }
    });
    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    });
}

export async function destroySession() {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (token) {
        await prisma.session.deleteMany({ where: { id: token } });
    }
    store.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const session = await prisma.session.findUnique({
        where: { id: token },
        include: { user: true }
    });
    if (!session || session.expiresAt < new Date()) return null;
    return session.user;
}
