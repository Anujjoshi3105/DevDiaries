"use server";

import { db } from "@/lib/db";
import { getIdAndRole } from "./user";

export const getAllComments = async (blogId: string, parentCommentId?: string) => {
    if (!blogId) {
        throw new Error('Required data is not provided');
    }

    try {
        const whereCondition: { blogId: string; parentCommentId?: string | null } = { blogId };
        if (parentCommentId !== undefined) {
            whereCondition.parentCommentId = parentCommentId;
        }

        const comments = await db.comment.findMany({
            where: whereCondition,
            include: {
                blog: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            }
                        }
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { response: comments };
    } catch (error) {
        console.error("Error getting comments", error);
        return { error: "Error getting comments" };
    }
};

export const NumberOfComments = async (blogId: string) => {
    try {
        const commentsNo = await db.comment.aggregate({
            where: { blogId },
            _count: true
        });

        return { response: commentsNo._count || 0 };
    } catch (error) {
        console.error("Error getting number of comments", error);
        return { error: "Error getting number of comments" };
    }
};

export const createComment = async (blogId: string, content: string, parentCommentId?: string) => {
    const { userId } = await getIdAndRole();
    if (!userId) {
        throw new Error('No user found');
    }
    if (!blogId || !content) {
        throw new Error('Required data is not provided');
    }

    try {
        const comment = await db.comment.create({
            data: {
                userId,
                blogId,
                content,
                parentCommentId
            }
        });

        return { response: comment };
    } catch (error) {
        console.error("Error creating comment", error);
        return { error: "Error creating comment" };
    }
};

export const deleteComment = async (commentId: string) => {
    const { userId } = await getIdAndRole();
    if (!userId) {
        throw new Error('No user found');
    }
    if (!commentId) {
        throw new Error('Required data is not provided');
    }

    try {
        const existingComment = await db.comment.findUnique({
            where: { id: commentId }
        });
        if (!existingComment) {
            throw new Error('Comment not found');
        }
        if (existingComment.userId !== userId && userId !== 'admin') {
            throw new Error('You are not authorized to delete this comment');
        }
        const comment = await db.comment.delete({
            where: { id: commentId }
        });

        return { response: comment };
    } catch (error) {
        console.error("Error deleting comment", error);
        return { error: "Error deleting comment" };
    }
};

export const updateComment = async (commentId: string, content: string) => {
    const { userId } = await getIdAndRole();
    if (!userId) {
        throw new Error('No user found');
    }
    if (!commentId || !content) {
        throw new Error('Required data is not provided');
    }

    try {
        const existingComment = await db.comment.findUnique({
            where: { id: commentId }
        });
        if (!existingComment) {
            throw new Error('Comment not found');
        }
        if (existingComment.userId !== userId && userId !== 'admin') {
            throw new Error('You are not authorized to update this comment');
        }
        const comment = await db.comment.update({
            where: { id: commentId },
            data: { content }
        });

        return { response: comment };
    } catch (error) {
        console.error("Error updating comment", error);
        return { error: "Error updating comment" };
    }
};
