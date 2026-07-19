import { User } from "@/generated/prisma/client"
import {getUserById, getPostsByUserId, getUserStats, getIsFollowing, followUser, unfollowUser} from "./actions"
import Link from "next/link"
import { getSessionUser } from "@/lib/session"
import { deletePost } from "@/app/actions"

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const sessionUser = await getSessionUser()
    const user: User | null = await getUserById(Number(id))
    const posts = await getPostsByUserId(Number(id))
    const stats = await getUserStats(Number(id))
    const isFollowing = sessionUser && user
        ? await getIsFollowing(sessionUser.id, user.id)
        : false

    if(!user) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
                <h1 className="text-2xl font-semibold dark:text-white">User not found</h1>
            </div>
        )
    }
    return (
        <div className="h-full flex flex-col flex-1 p-4 min-h-screen bg-zinc-50 font-sans dark:bg-black">
            <div className="flex justify-between w-full">
                <div>
                    <h1 className="text-2xl font-semibold dark:text-white">{user?.name || user?.email}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">@{user?.username}</p>
                </div>
                <div className="flex flex-row gap-x-2">
                    <div className="flex flex-col items-center">
                        <div>{stats.posts} </div>
                        posts
                    </div>
                 <div className="flex flex-col items-center">
                        <div> {stats.followers}</div> followers
                    </div>
                    <div className="flex flex-col items-center">
                        <div> {stats.following}</div> following
                    </div>
                </div>

                {sessionUser && sessionUser.id !== user.id && (
                    <div className="mt-2">
                        <form action={(isFollowing ? unfollowUser : followUser).bind(null, user.id)}>
                            <button
                                type="submit"
                                className="cursor-pointer bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-black"
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        </form>
                    </div>
                )}

            </div>
    
            <div className="mt-4 h-full">
                <h2 className="text-xl font-semibold dark:text-white">Posts</h2>
                <ul className="mt-2 space-y-2 h-full">
                    {posts.length === 0 && (
                        <div className="flex gap-y-2 flex-col h-full w-full justify-center items-center">
                        <p className="text-zinc-500 dark:text-zinc-400">No posts yet.</p>
                        <button className="cursor-pointer bg-zinc-900 px-4 py-2 text-white dark:bg-white dark:text-black">
                            <Link href="/post">Create Post</Link>
                        </button>
                        </div>
                    )}
                    {posts.map((post) => (
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
                  {post.images.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="max-h-64 border border-zinc-900 object-cover dark:border-zinc-700"
                    />
                  ))}
                </div>
              )}
              {sessionUser?.id === post.authorId && (
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
                </ul>
            </div>
        </div>
    )
}

export default UserPage