import { db } from "@/lib/db";
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId }: any = auth();
  if (!userId) {
    return NextResponse.json('User not present');
  }

  try {
    const { blogId } = await request.json();

    const blogExist = await db.blog.findUnique({
      where: {
        id: blogId,
      },
    });

    if (!blogExist) {
      throw new Error('blog does not exist');
    }

    const savedCheck = await db.save.findFirst({
      where: {
        blogId,
        userId,
      },
    });

    if (savedCheck) {
      // If already saved, delete the existing save
      await db.save.delete({
        where: {
          id: savedCheck.id,
        },
      });

      return NextResponse.json({ message: 'blog removed from saved stories' });
    } else {
      // If not saved, save the blog
      const saveblog = await db.save.create({
        data: {
          userId,
          blogId: blogExist.id,
        },
      });

      return NextResponse.json(saveblog);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.error();
  }
}
