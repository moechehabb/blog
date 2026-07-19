import prisma from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"
import { revalidatePath } from "next/cache"

const getUserById = async (id: number) => {
    if (!Number.isInteger(id)) return null
    const user = await prisma.user.findUnique({
        where: { id: id },
    })
    return user
}

const getPostsByUserId = async (userId: number) => {
    if (!Number.isInteger(userId)) return []
    const posts = await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { id: "desc" },
        include: { author: true }
    })
    return posts
}

const getUserStats = async (userId: number) => {
    const counts = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            _count: {
                select: { posts: true, followers: true, following: true }
            }
        }
    })
    return {
        posts: counts?._count.posts ?? 0,
        followers: counts?._count.followers ?? 0,
        following: counts?._count.following ?? 0
    }
}

const getIsFollowing = async (followerId: number, followingId: number) => {
    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: { followerId, followingId }
        }
    })
    return follow !== null
}

async function followUser(followingId: number) {
    "use server"
    const sessionUser = await getSessionUser()
    if (!sessionUser || sessionUser.id === followingId) return
    await prisma.follow.upsert({
        where: {
            followerId_followingId: { followerId: sessionUser.id, followingId }
        },
        create: { followerId: sessionUser.id, followingId },
        update: {}
    })
    revalidatePath(`/user/${followingId}`)
}

async function unfollowUser(followingId: number) {
    "use server"
    const sessionUser = await getSessionUser()
    if (!sessionUser) return
    await prisma.follow.deleteMany({
        where: { followerId: sessionUser.id, followingId }
    })
    revalidatePath(`/user/${followingId}`)
}

export { getUserById, getPostsByUserId, getUserStats, getIsFollowing, followUser, unfollowUser }
