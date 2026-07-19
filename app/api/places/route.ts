import { autocompletePlaces } from "@/lib/places";
import { getSessionUser } from "@/lib/session";

export async function GET(req: Request) {
    const user = await getSessionUser();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
    if (q.length < 3) {
        return Response.json({ suggestions: [] });
    }

    return Response.json({ suggestions: await autocompletePlaces(q) });
}
