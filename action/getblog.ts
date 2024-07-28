"use server"
import { db } from "@/lib/db"

export const getblogById = async (blogId: string) => {
    if(!blogId){
        throw new Error('Do not have blogId')
    }

    try {
        const blogById = await db.blog.findUnique({
            where:{
                id:blogId,
                publish:false
            }
        })

        return {response : blogById}
    } catch (error) {
        return {error: 'Error on getting the blog by Id'}
    }
}

export const getblogsByAuthor = async (blogId:string, authorId:string) => {
    try {
        const Authorblogs = await db.blog.findMany({
            where:{
                authorId,
                NOT:{
                    id:blogId
                },
                publish:true
            }
        })

        return {response: Authorblogs}
    } catch (error) {
        return {error: "Error on getting blogs by author"}
    }
}

export const getUniqueTopics = async () =>{
    try {
        const AllblogTopics = await db.blog.findMany({
            select:{
                topics:true
            }
        })

        const uniqueTopics = Array.from(new Set(AllblogTopics.flatMap((item)=> item.topics)))

        const formattedData = uniqueTopics.map(topic => ({
            value:topic,
            label:topic
        }))

        return {response : formattedData}
    } catch (error) {
        return {response: []}
    }
}

export const getblogByTag = async (tag:string) => {
    try {
        if(tag === 'All'){
            const Allblogs = await db.blog.findMany({
                where:{
                    publish:true
                }
            })
            return {blogs: Allblogs}
        }
        const taggedblogs = await db.blog.findMany({
            where:{
                topics:{
                    has:tag
                },
                publish:true
            }
        })
        return {blogs: taggedblogs}
    } catch (error) {
        return {blogs: []}
    }
}
