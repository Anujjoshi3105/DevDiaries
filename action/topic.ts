"use server"
import { db } from "@/lib/db"
import { auth } from "@/auth";

export const GetSelectedTopics = async () => {
    const session = await auth();
    const userId = session?.user?.id

    if(!userId) throw new Error('User not logged in')

    try {
        const tags = await db.topics.findFirst({
            where:{
                userId:userId
            },
            select:{
                selectedTopics:true
            }
        })
        
        const formattedData = tags?.selectedTopics.map(topic => ({
            value:topic,
            label:topic
        }))
        return {Tags: formattedData || []}
    } catch (error) {
        return {Tags: []}
    }
}