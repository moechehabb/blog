import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function POST(req: Request) {
    const body = await req.json();

    if(!body.email) {
        return new Response(JSON.stringify({ error: "Email is required" }), {
            status: 400
        });
    }

    const userExists = prisma.user.findMany({
        where: {
            email: body.email
        }
    })
    
    if(!userExists) {
        const user = await prisma.user.create({
            data: {
                email: body.email
            }
        })
        redirect("/onboarding");
    }
    return new Response(JSON.stringify({ userExists }), {
        status: 200
    });
}