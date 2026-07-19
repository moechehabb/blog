"use server"
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { resolveLocationId } from "@/lib/places";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
    const user = await getSessionUser();
    if (!user) {
        redirect("/login");
    }

    const name = String(formData.get("name") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim().toLowerCase();
    const address = String(formData.get("address") ?? "").trim();

    if (!name || !username) {
        redirect("/onboarding?error=Name+and+username+are+required");
    }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
        redirect("/onboarding?error=Username+must+be+3-20+characters+(letters,+numbers,+underscores)");
    }

    const taken = await prisma.user.findUnique({ where: { username } });
    if (taken && taken.id !== user.id) {
        redirect("/onboarding?error=Username+is+already+taken");
    }

    const placeId = String(formData.get("placeId") ?? "").trim();
    const lat = Number(formData.get("lat"));
    const lng = Number(formData.get("lng"));
    const locationId = placeId
        ? await resolveLocationId({
            placeId,
            address,
            lat: Number.isFinite(lat) ? lat : undefined,
            lng: Number.isFinite(lng) ? lng : undefined
        })
        : address
            ? (await prisma.location.create({ data: { address } })).id
            : null;

    await prisma.user.update({
        where: { id: user.id },
        data: {
            name,
            username,
            locationId
        }
    });

    redirect("/");
}
