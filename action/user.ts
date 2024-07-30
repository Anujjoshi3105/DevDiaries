"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth"
import { newPasswordSchema } from "@/schemas";
import { hash } from "bcryptjs";

export async function getIdAndRole() {
    const session = await auth();
    if (!session) {
      throw new Error('Login required');
    }
  
    const userId = session.user.id;
    const role = session.user.role;
    return { userId, role };
}


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

export const getUserByName = async (name: string) => {
  try {
    const normalizedName = name.toLowerCase();
    const user = await db.user.findUnique({ where: { name: normalizedName } , include: { blogs: { include: { author: true, likes: true }} } });

    if (user) {
      const { password, ...rest } = user;
      return rest;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error(error);
    return null;
  }
};



export const userInfo = async (id?: string) => {
    const { userId, role } = await getIdAndRole();

    try {
        if (id && role === "ADMIN") {
            const user = await db.user.findUnique({ where: { id } });
            if (user) {
                const { password, ...rest } = user;
                return { user: rest };
            } else {
                return { message: 'User not found.', status: 'error' };
            }
        } else if (userId) {
            const user = await db.user.findUnique({ where: { id: userId } });
            if (user) {
                const { password, ...rest } = user;
                return { user: rest };
            } else {
                return { message: 'User not found.', status: 'error' };
            }
        } else {
            return { message: 'User ID is required.', status: 'error' };
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return { message: 'An error occurred while fetching the user.', status: 'error' };
    }
};


export async function updateUser({
  id,
  username,
  email,
  profession,
  bio,
  image,
}: {
  id?: string;
  username?: string;
  email?: string;
  profession?: string;
  bio?: string;
  image?: string;
}
) {
  const { userId, role } = await getIdAndRole();

  const updateData: Partial<{
    name: string;
    email: string;
    profession: string;
    bio: string;
    image: string;
  }> = {};

  if (username) updateData.name = username.toLowerCase().trim();
  if (email) updateData.email = email.toLowerCase().trim();
  if (profession) updateData.profession = profession.trim();
  if (bio) updateData.bio = bio.trim();
  if (image) updateData.image = image;

  if (Object.keys(updateData).length === 0) {
    console.error('No data to update:', updateData);
    return { error: 'At least one field is required to update.'};
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('User not found:', user);
      return { error: 'User not found.' };
    }

    if (email) {
      const existingUser = await db.user.findUnique({ where: { email: updateData.email } });
      if (existingUser && existingUser.id !== userId) {
        console.error('Email already exists:', existingUser);
        return { error: 'Email already exists.' };
      }
    }

    if (username) {
      const existingUsername = await db.user.findUnique({ where: { name: updateData.name } });
      if (existingUsername && existingUsername.id !== userId) {
        console.error('Username already exists');
        return { error: 'Username already exists.' };
      }
    }

    if (role === 'ADMIN' && id) {
      await db.user.update({
        where: { id },
        data: updateData,
      });

      return { message: 'User updated successfully.' };
    } else {
      await db.user.update({
        where: { id: userId },
        data: updateData,
      });

      return { message: 'User updated successfully.' };
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return { error: 'An error occurred while updating the user.' };
  }
}

  
  
  export async function updatePassword(passwordForm: { newpassword: string; confirmpassword: string }, id?: string) {
    const { userId, role } = await getIdAndRole();
  
    const validation = newPasswordSchema.safeParse(passwordForm);
    if (!validation.success) {
      return { error: validation.error.errors[0].message };
    }
  
    const { newpassword, confirmpassword } = validation.data;
    const hashedPassword = await hash(newpassword, 10);
  
    try {
      const targetUserId = role === 'ADMIN' && id ? id : userId;
  
      if (!targetUserId) {
        return { message: 'User ID is required.', status: 'error' };
      }
  
      // Find the user
      const user = await db.user.findUnique({ where: { id: targetUserId } });
      if (!user) {
        return { message: 'User not found.', status: 'error' };
      }
  
      // Update the password
      await db.user.update({
        where: { id: targetUserId },
        data: { password: hashedPassword },
      });
  
      return { message: 'Password updated successfully!', status: 'success' };
    } catch (error) {
      console.error('Error updating password:', error);
      return { message: 'Failed to update password.', status: 'error' };
    }
  }
  export async function deleteUser( id?: string ) {
    const { userId, role } = await getIdAndRole();
    try{
        if(id && role == "ADMIN") {
        await db.user.delete({ where: { id } }); 
        } else if (userId){
            await db.user.delete({ where: {id: userId } });
        }
        else{
            return { message: 'User ID is required.', status: "error" };
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        return { message: 'Failed to delete user.', status: "error" };
    }
}

export async function getAllUsers() {
    try {
        const users = await db.user.findMany();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}