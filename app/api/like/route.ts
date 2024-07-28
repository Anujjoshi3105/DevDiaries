import { db } from "@/lib/db";
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const session = await auth();
    const {userId} : any = session?.user?.id
    if(!userId) throw new Error ('No user found')

    try {
        const {blogId} = await request.json()

        const blogExist = await db.blog.findUnique({
            where:{
                id:blogId
            }
        })
        
        if(!blogExist){
            throw new Error ('No Stories were found to like')
        }

        const likeped = await db.like.findFirst({
            where:{
                blogId,
                userId
            }
        })

        if(likeped && likeped.likeCount < 50){
            await db.like.update({
                where:{
                    id:likeped.id
                },
                data:{
                    likeCount:likeped.likeCount + 1
                }
            })

            return NextResponse.json('like updated!')
        }
        else{
            const likeblog = await db.like.create({
                data:{
                    userId,
                    blogId:blogExist.id,
                    likeCount:1
                }
            })
            return NextResponse.json('like created')
        }
    } catch (error) {
        console.log("Error liking the blog", error)
        return NextResponse.error()
    }
}