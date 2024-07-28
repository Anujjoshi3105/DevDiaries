import { db } from "@/lib/db";
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await auth()
    const { userId } : any = session?.user.id;
    
    if (!userId) {
      return NextResponse.json('User not present');
    }

    try {
        const {tag} = await request.json()
        
        const Topic = await db.topics.findFirst({
            where:{
                userId
            }
        })

        if (!Topic) {
            await db.topics.create({
                data: {
                    userId,
                    selectedTopics: tag
                }
            });
        } else {
            await db.topics.update({
                where: {
                    id: Topic.id
                },
                data: {
                    selectedTopics: tag
                }
            });
        }

        return NextResponse.json({ message: 'Added tags successfully' });
    } catch (error) {
        console.log('Error while adding topics/tags')
        return NextResponse.error()
    }
}