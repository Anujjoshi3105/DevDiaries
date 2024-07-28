"use server";

import { db } from "@/lib/db";
import { getIdAndRole } from "@/action/user";

export const CheckFollowing = async (authorId: string): Promise<{ ifFollowing: boolean }> => {
  const { userId } = await getIdAndRole();
  if (!userId) throw new Error('No user found');
  try {
    const IsFollowed = await db.following.findFirst({
      where: {
        followingId: authorId,
        followerId: userId
      }
    });

    return { ifFollowing: !!IsFollowed };
  } catch (error) {
    console.error(error);
    return { ifFollowing: false };
  }
};

export const toggleFollow = async (authorId: string): Promise<boolean> => {
  const { userId } = await getIdAndRole();
  if (!userId) throw new Error('No user found');

  try {
    const existingFollow = await db.following.findFirst({
      where: {
        followingId: authorId,
        followerId: userId
      }
    });

    if (existingFollow) {
      await db.following.delete({ where: { id: existingFollow.id } });
      return false;
    } else {
      await db.following.create({
        data: {
          followingId: authorId,
          followerId: userId
        }
      });
      return true;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error toggling follow status');
  }
};

export const NumberFollowers = async (authorId: string): Promise<{ followers: number }> => {
  try {
    const NoOfFollowing = await db.following.aggregate({
      where: {
        followingId: authorId
      },
      _count: true
    });

    return { followers: NoOfFollowing._count || 0 };
  } catch (error) {
    console.error(error);
    return { followers: 0 };
  }
};
