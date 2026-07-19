import { getSessionUser } from "@/lib/session";
import { signOut } from "../actions";
import { createPost } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import LocationInput from "@/components/location-input";
import PhotoPicker from "@/components/photo-picker";

export default async function Post({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const user = await getSessionUser()
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="p-4">
      <div className="mt-4">
        <div className="flex justify-between w-full">
          <h1>Post</h1>
          <Link href="/">Back</Link>
        </div>
        <form action={createPost} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              required
              placeholder="I just found this new great place in Nob Hill"
              className="ml-4 w-[300px] border bg-white px-4 py-2 border-zinc-900 focus:border-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div className="flex items-start">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={6}
              placeholder="Tell everyone about it..."
              className="ml-4 w-[300px] border bg-white px-4 py-2 border-zinc-900 focus:border-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div className="flex items-start">
            <label>Photos</label>
            <div className="ml-4 w-[300px]">
              <PhotoPicker />
            </div>
          </div>
          <div className="flex items-start">
            <label htmlFor="address">Location</label>
            <div className="ml-4 w-[300px]">
              <LocationInput className="w-full border bg-white px-4 py-2 border-zinc-900 focus:border-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-white" />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              className="cursor-pointer bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-black"
            >
              Publish
            </button>
            <button
              type="submit"
              name="draft"
              value="1"
              className="cursor-pointer border border-zinc-900 px-4 py-2 dark:border-white dark:text-white"
            >
              Save draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
