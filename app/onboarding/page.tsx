import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { completeOnboarding } from "./actions";
import LocationInput from "@/components/location-input";

const inputClass = "rounded-lg border border-zinc-300 bg-white px-4 py-2 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white";

const Onboarding = async ({ searchParams }: { searchParams: Promise<{ error?: string }> }) => {
    const { error } = await searchParams;
    const user = await getSessionUser();
    if (!user) {
        redirect("/login");
    }
    if (user.username) {
        redirect("/");
    }
    return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
            <form action={completeOnboarding} className="flex flex-col gap-4 w-72">
                <h1 className="text-2xl font-semibold text-center dark:text-white">Set up your profile</h1>
                <label className="text-zinc-500 dark:text-zinc-400" htmlFor="name">Name</label>
                <input id="name" name="name" type="text" required className={inputClass} />
                <label className="text-zinc-500 dark:text-zinc-400" htmlFor="username">Username</label>
                <input id="username" name="username" type="text" required className={inputClass} />
                <label className="text-zinc-500 dark:text-zinc-400" htmlFor="address">Location (optional)</label>
                <LocationInput className={inputClass + " w-full"} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-black"
                >
                    Continue
                </button>
            </form>
        </div>
    )
}

export default Onboarding
