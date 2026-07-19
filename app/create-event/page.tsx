import { getSessionUser } from "@/lib/session";
import { createEvent } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import LocationInput from "@/components/location-input";

export default async function CreateEvent({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const user = await getSessionUser()
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="p-4">
      <div className="mt-4">
        <div className="flex justify-between w-full">
          <h1>Create event</h1>
          <Link href="/">Back</Link>
        </div>
        <form action={createEvent} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              required
              placeholder="Rooftop picnic at sunset"
              className="ml-4 w-[300px] border bg-white px-4 py-2 border-zinc-900 focus:border-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div className="flex items-start">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="What's happening, who should come..."
              className="ml-4 w-[300px] border bg-white px-4 py-2 border-zinc-900 focus:border-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              required
              className="ml-4 w-[300px] border bg-white px-4 py-2 border-zinc-900 focus:border-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div className="flex items-start">
            <label htmlFor="address">Location</label>
            <div className="ml-4 w-[300px]">
              <LocationInput className="w-full border bg-white px-4 py-2 border-zinc-900 focus:border-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-white" />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="cursor-pointer bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-black"
            >
              Create event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
