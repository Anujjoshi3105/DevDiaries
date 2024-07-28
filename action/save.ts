"use server"

import { db } from "@/lib/db";
import { getIdAndRole } from "@/action/user";

export const CheckSaved = async (blogId: string): Promise<{ Status: boolean }> => {
    const { userId } = await getIdAndRole();
    if (!userId) throw new Error('No user found');
    try {
        const saved = await db.save.findFirst({
            where: {
                blogId,
                userId,
            }
        });
        return { Status: !!saved };
    } catch (error) {
        console.error(error);
        return { Status: false };
    }
};

export const toggleSave = async (blogId: string): Promise<boolean> => {
    const { userId } = await getIdAndRole();
    if (!userId) throw new Error('No user found');

    try {
        const existingSave = await db.save.findFirst({
            where: { blogId, userId },
        });

        if (existingSave) {
            await db.save.delete({ where: { id: existingSave.id } });
            return false;
        } else {
            await db.save.create({
                data: {
                    blogId,
                    userId,
                },
            });
            return true;
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error toggling save');
    }
};

export const getUserSavedBlogs = async (userId: string) => {
    try {
        const blogs = await db.save.findMany({
            where: { userId, }, include: { blog: true, },
        });

        return { blogs };
    } catch (error) {
        console.error(error);
        return { blogs: [] };
    }
};
