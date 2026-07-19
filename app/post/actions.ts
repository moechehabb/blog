"use server"
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { resolveLocationId } from "@/lib/places";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";

const IMAGE_EXTENSIONS: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif"
};

async function savePhotos(formData: FormData) {
    const photos = formData
        .getAll("photos")
        .filter((f): f is File => f instanceof File && f.size > 0);
    if (photos.length === 0) return [];

    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });

    const images: string[] = [];
    for (const photo of photos) {
        const ext = IMAGE_EXTENSIONS[photo.type];
        if (!ext) {
            redirect("/post?error=Only+JPEG%2C+PNG%2C+WebP%2C+GIF+or+AVIF+images+are+allowed");
        }
        const filename = randomBytes(8).toString("hex") + ext;
        await writeFile(path.join(dir, filename), Buffer.from(await photo.arrayBuffer()));
        images.push(`/uploads/${filename}`);
    }
    return images;
}

export async function createPost(formData: FormData) {
    const user = await getSessionUser();
    if (!user) {
        redirect("/login");
    }

    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const published = formData.get("draft") == null;

    if (!title) {
        redirect("/post?error=Title+is+required");
    }

    const placeId = String(formData.get("placeId") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const lat = Number(formData.get("lat"));
    const lng = Number(formData.get("lng"));
    const locationId = placeId
        ? await resolveLocationId({
            placeId,
            address,
            lat: Number.isFinite(lat) ? lat : undefined,
            lng: Number.isFinite(lng) ? lng : undefined
        })
        : null;

    const images = await savePhotos(formData);

    await prisma.post.create({
        data: {
            title,
            content: content || null,
            images,
            published,
            authorId: user.id,
            locationId
        }
    });

    redirect("/");
}
