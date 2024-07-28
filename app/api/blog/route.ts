import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { BlogSchema } from '@/schemas';

// Function to handle POST requests (Create a new blog)
export async function POST(request: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    try {
        const data = await request.json();
        const validation = BlogSchema.safeParse(data);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.message }, { status: 400 });
        }

        const { title, content, topics, image } = validation.data;
        
        const blog = await db.blog.create({
            data: {
                authorId: userId,
                title,
                content,
                topics,
                image,
            },
        });

        return NextResponse.json({ blog }, { status: 201 });
    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const blogId = request.nextUrl.searchParams.get('blogId');
    let authorId = request.nextUrl.searchParams.get('authorId');
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;
  
    if (!blogId && !authorId) {
      if (!userId) {
        return NextResponse.json({ message: 'Author ID or session required' }, { status: 400 });
      }
      authorId = userId;
    }
  
    if (blogId) {
      try {
        const blog = await db.blog.findUnique({
          where: { id: blogId },
        });
  
        if (!blog || (!blog.publish && userId !== blog.authorId && role !== 'admin')) {
          return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }
  
        return NextResponse.json({ blog }, { status: 200 });
      } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
      }
    } else if (authorId) {
      try {
        const blogs = await db.blog.findMany({
          where: { authorId },
        });
  
        if (!blogs.length) {
          return NextResponse.json({ message: 'No blogs found' }, { status: 404 });
        }
  
        const accessibleBlogs = blogs.filter(blog => blog.publish || userId === blog.authorId || role === 'admin');
  
        if (!accessibleBlogs.length) {
          return NextResponse.json({ message: 'No accessible blogs found' }, { status: 404 });
        }
  
        return NextResponse.json({ blogs: accessibleBlogs }, { status: 200 });
      } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ message: 'Either blogId or authorId is required' }, { status: 400 });
    }
  }
// Function to handle PUT requests (Update an existing blog)
export async function PUT(request: NextRequest) {
    const blogId = request.nextUrl.searchParams.get('blogId');
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;
  
    if (!blogId) {
      return NextResponse.json({ message: 'Blog id required' }, { status: 400 });
    }
  
    try {
      const data = await request.json();
      const validation = BlogSchema.safeParse(data);
  
      if (!validation.success) {
        return NextResponse.json({ message: validation.error.message }, { status: 400 });
      }
  
      const { title, content, topics, image } = validation.data;
      let blog = await db.blog.findUnique({
          where : { id: blogId },
      })

      if (!blog || (!blog.publish && userId !== blog.authorId && role !== 'admin')) {
        return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
      }

      blog = await db.blog.update({
        where: { id: blogId },
        data: {
          title,
          content,
          topics,
          image,
        },
      });
  
      return NextResponse.json({ blog }, { status: 200 });
    } catch (error) {
      console.error('Error updating blog:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }


// Function to handle PATCH requests (Autosave a blog by id)
export async function PATCH(request: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;
    const id = request.nextUrl.pathname.split('/').pop();

    if (!id) {
        return NextResponse.json({ message: 'Blog id required' }, { status: 400 });
    }

    if (!userId || role !== 'admin') {
        return NextResponse.json({ message: "Admin privileges required" }, { status: 401 });
    }

    try {
        const updatedData = await request.json();
        const updatedBlog = await db.blog.update({
            where: { id },
            data: updatedData,
        });

        return NextResponse.json({ blog: updatedBlog }, { status: 200 });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        } else {
            console.error("Error updating blog:", error);
            return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        }
    }
}

// Function to handle DELETE requests (Delete a blog by id)
export async function DELETE(request: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;
    const id = request.nextUrl.pathname.split('/').pop();

    if (!id) {
        return NextResponse.json({ message: 'Blog id required' }, { status: 400 });
    }

    if (!userId || role !== 'admin') {
        return NextResponse.json({ message: "Admin privileges required" }, { status: 401 });
    }

    try {
        const deletedBlog = await db.blog.delete({
            where: { id },
        });

        return NextResponse.json({ blog: deletedBlog }, { status: 200 });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        } else {
            console.error("Error deleting blog:", error);
            return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        }
    }
}
