"use server";
import { db } from "@/lib/db";

export const NumberBlogs = async (authorId: string): Promise<{ blogs: number }> => {
  try {
    const totalBlogs = await db.blog.count({
      where: { authorId },
    });
    return { blogs: totalBlogs };
  } catch (error) {
    console.error("Error fetching total blogs:", error);
    return { blogs: 0 };
  }
};

export const NumberLikes = async (authorId: string): Promise<{ likes: number }> => {
  try {
    const totalLikes = await db.like.count({
      where: {
        blog: {
          authorId,
        },
      },
    });
    return { likes: totalLikes };
  } catch (error) {
    console.error("Error fetching total likes:", error);
    return { likes: 0 };
  }
};

export const NumberViews = async (authorId: string): Promise<{ views: number }> => {
  try {
    const totalViews = await db.blog.aggregate({
      _sum: {
        views: true,
      },
      where: {
        authorId,
      },
    });
    return { views: totalViews._sum.views || 0 };
  } catch (error) {
    console.error("Error fetching total views:", error);
    return { views: 0 };
  }
};

export const NumberSaves = async (userId: string): Promise<{ saves: number }> => {
  try {
    const totalSaves = await db.save.count({
      where: { userId },
    });
    return { saves: totalSaves };
  } catch (error) {
    console.error("Error fetching total saves:", error);
    return { saves: 0 };
  }
};

export const NumberFollowing = async (authorId: string): Promise<{ following: number }> => {
    try {
      const NoOfFollowing = await db.following.count({
        where: {
          followerId: authorId
        },
      });
  
      return { following: NoOfFollowing };
    } catch (error) {
      console.error(error);
      return { following: 0 };
    }
  };
  
  export const NumberFollowers = async (authorId: string): Promise<{ followers: number }> => {
    try {
      const NoOfFollowers = await db.following.count({
        where: {
          followingId: authorId
        },
      });
  
      return { followers: NoOfFollowers };
    } catch (error) {
      console.error(error);
      return { followers: 0 };
    }
  };
  

  export const NumberTopics = async (
    authorId?: string,
    blogId?: string,
    quantity: number = 10,
    sortBy: 'views' | 'likes' = 'views'
  ): Promise<{ totalTopics: number; topics: string[] }> => {
    try {
      let queryCondition: any = {};
  
      if (authorId) {
        queryCondition.authorId = authorId;
      }
  
      if (blogId) {
        queryCondition.id = blogId;
      }
  
      const blogs = await db.blog.findMany({
        where: queryCondition,
        select: {
          topics: true,
          views: true,
          likes: {
            select: {
              likeCount: true,
            },
          },
        },
        orderBy: sortBy === 'views' ? { views: 'desc' } : { likes: { _count: 'desc' } },
        take: quantity,
      });
  
      const allTopics = blogs.flatMap(blog => blog.topics);
      const uniqueTopics = Array.from(new Set(allTopics)).slice(0, quantity);
  
      return { totalTopics: uniqueTopics.length, topics: uniqueTopics };
    } catch (error) {
      console.error('Error counting unique topics:', error);
      return { totalTopics: 0, topics: [] };
    }
  };
