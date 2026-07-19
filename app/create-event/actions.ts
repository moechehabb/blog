"use server"
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { resolveLocationId } from "@/lib/places";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
    const user = await getSessionUser();
    if (!user) {
        redirect("/login");
    }

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const date = new Date(String(formData.get("date") ?? ""));

    if (!title) {
        redirect("/create-event?error=Title+is+required");
    }
    if (Number.isNaN(date.getTime())) {
        redirect("/create-event?error=A+valid+date+is+required");
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

    if (!locationId) {
        redirect("/create-event?error=Pick+a+location+so+people+can+find+your+event");
    }

    await prisma.event.create({
        data: {
            title,
            description: description || null,
            date,
            organizerId: user.id,
            locationId
        }
    });

    redirect("/?tab=map");
}
