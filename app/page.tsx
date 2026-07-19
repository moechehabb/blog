import { getSessionUser } from "@/lib/session";
import prisma from "@/lib/prisma";
import { deletePost } from "./actions";
import Link from "next/link";
import EventsMap from "@/components/events-map";

export default async function Home({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const showMap = tab === "map";
  const user = await getSessionUser();

  return (
    <div className="p-4">
      <div className="mt-4">
        <div className="flex justify-between w-full">
          <div className="flex gap-4">
            <Link
              href="/"
              className={!showMap ? "font-semibold underline" : "text-zinc-500 dark:text-zinc-400"}
            >
              Feed
            </Link>
            <Link
              href="/?tab=map"
              className={showMap ? "font-semibold underline" : "text-zinc-500 dark:text-zinc-400"}
            >
              Map
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="/post">+ Post</Link>
            <Link href="/create-event">+ Event</Link>
          </div>
        </div>
        {showMap ? <MapTab /> : <FeedTab userId={user?.id} />}
      </div>
    </div>
  );
}

async function FeedTab({ userId }: { userId?: number }) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { id: "desc" },
    include: { author: true }
  });
  return (
    <div className="mt-4 flex flex-col gap-4">
      {posts.length === 0 && (
        <p className="text-zinc-500 dark:text-zinc-400">No posts yet. Be the first!</p>
      )}
      {posts.map(post => (
        <div key={post.id} className="border border-zinc-900 p-4 dark:border-zinc-700">
          <div className="flex justify-between">
            <h2 className="font-semibold">{post.title}</h2>
            <Link href={`/user/${post.author.id}`} className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              @{post.author.username ?? post.author.email}
            </span>
            </Link>
          </div>
          {post.content && <p className="mt-2">{post.content}</p>}
          {post.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {post.images.map(src => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="max-h-64 border border-zinc-900 object-cover dark:border-zinc-700"
                />
              ))}
            </div>
          )}
          {userId === post.authorId && (
            <form action={deletePost.bind(null, post.id)} className="mt-2">
              <button
                type="submit"
                className="cursor-pointer text-sm text-red-600"
              >
                Delete
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

async function MapTab() {
  const events = await prisma.event.findMany({
    where: { location: { lat: { not: null }, lng: { not: null } } },
    include: { organizer: true, location: true },
    orderBy: { date: "asc" }
  });
  const mapEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    organizer: event.organizer.username ?? event.organizer.email,
    address: event.location!.address,
    lat: event.location!.lat!,
    lng: event.location!.lng!
  }));
  return (
    <div className="mt-4">
      {mapEvents.length === 0 && (
        <p className="mb-2 text-zinc-500 dark:text-zinc-400">
          No events yet. <Link href="/create-event" className="underline">Create the first one!</Link>
        </p>
      )}
      <EventsMap events={mapEvents} />
    </div>
  );
}
