"use server"
import prisma from "@/lib/prisma";
import { destroySession, getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

export async function signOut() {
    await destroySession();
    redirect("/login");
}

export async function deletePost(postId: number) {
    const user = await getSessionUser();
    if (!user) {
        redirect("/login");
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== user.id) {
        return;
    }

    await prisma.post.delete({ where: { id: postId } });

    // Best-effort cleanup of uploaded photos; missing files are fine.
    await Promise.all(
        post.images
            .filter(img => img.startsWith("/uploads/"))
            .map(img =>
                unlink(path.join(process.cwd(), "public", img)).catch(() => {})
            )
    );

    revalidatePath("/");
    revalidatePath(`/user/${user.id}`);
}
