"use server"

import { db } from "@/lib/db";
import { getIdAndRole } from "@/action/user";

export const likeCount = async (blogId: string, commentId?: string): Promise<number> => {
    try {
        const whereClause: any = { blogId };
        if (commentId) whereClause.commentId = commentId;

        const like = await db.like.aggregate({
            where: whereClause,
            _sum: { likeCount: true },
        });

        return like._sum?.likeCount || 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
};

export const likeCountByUser = async (blogId: string, commentId?: string): Promise<number> => {
    const { userId } = await getIdAndRole();
    if (!userId) throw new Error("No logged user");

    try {
        const whereClause: any = { blogId, userId };
        if (commentId) whereClause.commentId = commentId;

        const like = await db.like.aggregate({
            where: whereClause,
            _sum: { likeCount: true },
        });

        return like._sum?.likeCount || 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
};

export const toggleLike = async (blogId: string, commentId?: string): Promise<boolean> => {
    const { userId } = await getIdAndRole();
    if (!userId) throw new Error("No logged user");

    try {
        const whereClause: any = { blogId, userId };
        if (commentId) whereClause.commentId = commentId;

        const existingLike = await db.like.findFirst({
            where: whereClause,
        });

        if (existingLike) {
            await db.like.delete({ where: { id: existingLike.id } });
            return false;
        } else {
            await db.like.create({
                data: {
                    blogId,
                    userId,
                    commentId: commentId || null,
                    likeCount: 1,
                },
            });
            return true;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error toggling like");
    }
};
