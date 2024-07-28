import { db } from "@/lib/db";
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const session = await auth()
    const { userId } : any = session?.user?.id
    if(!userId) throw new Error ('No user found')

    try {
        const body = await request.json()
        const {blogId, Content, parentCommentId} = body

        if(!blogId || !Content || !parentCommentId){
            throw new Error('Insuficient data')
        }

        const existingblog = await db.blog.findUnique({
            where:{
                id:blogId
            }
        })

        if(!existingblog){
            throw new Error('No stories were found to comment')
        }

        const newComment = await db.comment.create({
            data:{
                userId,
                blogId,
                parentCommentId,
                content:Content
            }
        })

        return NextResponse.json('Successfully commented on blog')
    } catch (error) {
        console.log("Error in commenting", error)
        return NextResponse.error()
    }
}