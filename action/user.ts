import { db } from "@/lib/db";

export const getUserByEmail = async(email: string) => {
    try{
        const normalizedEmail = email.toLowerCase();
        const user = await db.user.findUnique({ where: {email: normalizedEmail} });
        return user;
    } catch(error: any) {
        return null;
    }
}

export const getUserById = async(id: string) => {
    try{
        const user = await db.user.findUnique({ where: {id} });
        return user;
    } catch(error: any) {
        return null;
    }
}

export const getUserByName = async(name: string) => {
    try{
        const normalizedName = name.toLowerCase();
        const user = await db.user.findUnique({ where: {name: normalizedName} });
        return user;
    } catch(error: any) {
        return null;
    }
}