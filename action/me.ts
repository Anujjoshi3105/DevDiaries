"use server"
import { db } from "@/lib/db"
import { getIdAndRole } from "@/action/user"

export const getDraftblog = async () => {
    const { userId } = await getIdAndRole()
    if(!userId) return {response: []}
    try {
        const blogs = await db.blog.findMany({
            where:{
                publish: false,
                authorId: userId
            }
        })

        return {response: blogs}
    } catch (error) {
        return {response: []}
    }
}


export const getSavedblog = async () => {
    const { userId } = await getIdAndRole()
    if(!userId) return {response: []}
    try {
        const stories = await db.blog.findMany({
            where:{
                publish: true,
                saves: {
                    some:{
                        userId
                    }
                }
            }
        })

        return {response: stories}
    } catch (error) {
        return {response: []}
    }
}
