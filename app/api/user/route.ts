import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { BlogSchema } from '@/schemas';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('userId');
  
  if (!id) {
    return NextResponse.json({ message: 'User id required' }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
        where: { id },
        include: {
            blogs: {
                include: {
                    comments: true,
                    likes: true,
                    saves: true
                }
            },
            comments: {
                include: {
                    replies: true
                }
            },
            likes: true,
            saves: true,
        }
    });
    return NextResponse.json({ user: user }, { status: 200 });
  } catch (error) {
      console.error('Error fetching blog:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
