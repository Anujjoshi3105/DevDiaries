"use server"

import { db } from "@/lib/db";
import { getIdAndRole } from "@/action/user";

export const likeCount = async (blogId?: string, commentId?: string): Promise<number> => {
    try {
        if (!blogId && !commentId) throw new Error("No blog or comment ID provided");

        const whereClause: any = {};
        if (commentId) whereClause.commentId = commentId;
        else whereClause.blogId = blogId;
        
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

export const likeCountByUser = async (blogId?: string, commentId?: string): Promise<number> => {
    const { userId } = await getIdAndRole();
    if (!userId) throw new Error("No logged user");

    try {
        if (!blogId && !commentId) throw new Error("No blog or comment ID provided");

        const whereClause: any = { userId };
        if (commentId) whereClause.commentId = commentId;
        else whereClause.blogId = blogId;
        
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
        if (!blogId && !commentId) throw new Error("No blog or comment ID provided");

        const whereClause: any = { userId };
        if (commentId) whereClause.commentId = commentId;
        else whereClause.blogId = blogId;
        
        const existingLike = await db.like.findFirst({
            where: whereClause,
        });

        if (existingLike) {
            await db.like.delete({ where: { id: existingLike.id } });
            return false;
        } else {
            await db.like.create({
                data: {
                    blogId: blogId,
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
