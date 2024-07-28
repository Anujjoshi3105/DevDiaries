import { db } from "@/lib/db";
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  const {userId} : any = session?.user?.id
    if (!userId) {
    return NextResponse.json('User not present');
  }

  try {
    const { AuthorId } = await request.json();


    const FollowingCheck = await db.following.findFirst({
      where: {
        followingId:AuthorId,
        followerId:userId,
      },
    });

    if (FollowingCheck) {
      await db.following.delete({
        where: {
          id: FollowingCheck.id
        },
      });

      return NextResponse.json({ message: 'Unfollowed the Author Succesfully' });
    } else {
      // If not saved, save the story
      const FollowingAuthor = await db.following.create({
        data: {
            followingId:AuthorId,
            followerId:userId,
        },
      });

      return NextResponse.json(FollowingAuthor);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.error();
  }
}
