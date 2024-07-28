"use server";

import { db } from '@/lib/db';
import { BlogSchema } from '@/schemas';
import { getIdAndRole } from '@/action/user';


export async function createBlog(formData? : FormData) {
  try {
      const { userId } = await getIdAndRole();

      if (!userId) {
          return { message: 'User ID is required.' };
      }

      const validation = BlogSchema.safeParse(formData);
      if (!validation.success) {
          return { message: validation.error.message };
      }

      const { title, content, topics, image } = validation.data;
      const blog = await db.blog.create({
          data: {
              authorId: userId,
              title,
              content,
              topics,
              image,
          }
      });
      return {blog};
  } catch (error) {
      console.error('Error creating blog:', error);
      return { message: 'An error occurred while creating the blog.' };
  }
}

// Get a blog by ID or all blogs by author ID
export async function getBlog(blogId?: string, authorId?: string | null) {
  let userId = null;
  let role = null;

  try {
    const user = await getIdAndRole();
    userId = user.userId;
    role = user.role;
  } catch (error) {
    // If getIdAndRole fails, userId and role remain null
  }

  try {
    // Default the authorId to the current user's ID if not provided
    authorId = authorId || userId;

    if (blogId) {
      // Fetch the blog by its ID
      const blog = await db.blog.findUnique({
        where: { id: blogId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              password: false,
            },
          },
        },
      });

      // Check if the blog exists and if the user has access to it
      if (!blog || (!blog.publish && userId !== blog.authorId && role !== 'admin')) {
        return { message: 'Blog not found' };
      }
      return { blog };
    }

    if (authorId) {
      // Fetch all blogs by the author ID
      const blogs = await db.blog.findMany({ where: { authorId } });

      // Check if any blogs were found
      if (!blogs.length) {
        return { message: 'No blogs found' };
      }

      // Filter blogs based on accessibility (published or user's own blog or admin)
      const accessibleBlogs = blogs.filter(
        blog => blog.publish || userId === blog.authorId || role === 'admin'
      );

      if (!accessibleBlogs.length) {
        return { message: 'No accessible blogs found' };
      }

      return { blogs: accessibleBlogs };
    }

    // Require either a blog ID or an author ID
    return { message: 'Either blogId or authorId is required' };
  } catch (error) {
    // Log and return an error message in case of an exception
    console.error('Error fetching blog(s):', error);
    return { message: 'Internal server error' };
  }
}

// Update an existing blog
export async function updateBlog(blogId: string, formData: FormData | null) {
  try {
    const { userId, role } = await getIdAndRole();

    if (!blogId) {
      return { message: 'Blog id required' };
    }

    const validation = BlogSchema.safeParse(formData);
    if (!validation.success) {
      return { message: validation.error.message };
    }

    const { title, content, topics, image } = validation.data;
    let blog = await db.blog.findUnique({ where: { id: blogId } });
    if (!blog || (!blog.publish && userId !== blog.authorId && role !== 'admin')) {
      return { message: 'Blog not found' };
    }

    blog = await db.blog.update({
      where: { id: blogId },
      data: { title, content, topics, image },
    });

    return { blog };
  } catch (error) {
    console.error('Error updating blog:', error);
    return { message: 'Internal server error' };
  }
}

// Delete a blog by ID
export async function deleteBlog(blogId: string) {
  try {
    const { userId, role } = await getIdAndRole();

    if (!blogId) {
      return { message: 'Blog id required' };
    }

    const blog = await db.blog.findUnique({ where: { id: blogId } });
    if (!blog) {
      return { message: 'Blog not found' };
    }

    if (userId !== blog.authorId && role !== 'admin') {
      return { message: 'Admin privileges required' };
    }

    const deletedBlog = await db.blog.delete({ where: { id: blogId } });
    return { blog: deletedBlog };
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { message: 'Blog not found' };
    } else {
      console.error('Error deleting blog:', error);
      return { message: 'Internal server error' };
    }
  }
}

// Toggle publish status of a blog
export async function togglePublish(blogId: string) {
  try {
    const { userId, role } = await getIdAndRole();

    if (!blogId) {
      return { message: 'Blog id required' };
    }

    const blog = await db.blog.findUnique({ where: { id: blogId } });
    if (!blog) {
      return { message: 'Blog not found' };
    }

    if (userId !== blog.authorId && role !== 'admin') {
      return { message: 'Admin privileges required' };
    }

    const updatedBlog = await db.blog.update({
      where: { id: blogId },
      data: { publish: !blog.publish },
    });

    return { blog: updatedBlog };
  } catch (error) {
    console.error('Error toggling publish status:', error);
    return { message: 'Internal server error' };
  }
}
