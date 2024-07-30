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


export const getFollower = async (authorId: string): Promise<{ followers: { id: string; name: string; email: string; image: string }[] }> => {
  try {
    const followers = await db.following.findMany({
      where: {
        followingId: authorId
      },
      include: {
        follower: { // 'follower' should be included as per the relation name in schema
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return { followers: followers.map(f => f.follower) };
  } catch (error) {
    console.error("Error fetching followers:", error);
    return { followers: [] };
  }
}


export const getFollowing = async (authorId: string): Promise<{ following: { id: string; name: string; email: string; image: string }[] }> => {
  try {
    const following = await db.following.findMany({
      where: {
        followerId: authorId
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return { following: following.map(f => f.following) };
  } catch (error) {
    console.error("Error fetching following:", error);
    return { following: [] };
  }
}
