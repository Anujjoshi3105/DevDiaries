'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '@/firebase';
import { signOut, useSession } from 'next-auth/react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { userSchema, newPasswordSchema } from '@/schemas';
import { deleteUser, updatePassword, userInfo, updateUser } from '@/action/user';
import { Password } from '@/components/ui/password';
import { LoaderCircle } from 'lucide-react';

type UserForm = {
  username: string;
  email: string;
  image: string;
  profession: string;
  bio: string;
};

type PasswordForm = {
  newpassword: string;
  confirmpassword: string;
};

type Errors = {
  [key: string]: string;
};

export default function Setting() {
  const { data: session } = useSession();
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userForm, setUserForm] = useState<UserForm>({
    username: '',
    email: '',
    image: '',
    profession: '',
    bio: '',
  });
  const [userErrors, setUserErrors] = useState<Errors>({});
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    newpassword: '',
    confirmpassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Errors>({});
  const [userLoading, setUserLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const result = await userInfo();
      if (result.user) {
        setUserForm({
          username: result.user.name || '',
          email: result.user.email || '',
          image: result.user.image || '',
          profession: result.user.profession || '',
          bio: result.user.bio || '',
        });
      }
    };

    fetchUserInfo();
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const storageRef = ref(storage, `${session?.user?.id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        setUploading(false);
        console.error('Upload error:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload image.',
          variant: 'destructive',
        });
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUserForm((prev) => ({ ...prev, image: downloadURL }));
        setUploading(false);
      }
    );
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserLoading(true);
    try {
      userSchema.parse(userForm);
      setUserErrors({});

      if (uploading) {
        toast({
          title: 'Error',
          description: 'Image is still uploading. Please wait.',
          variant: 'destructive',
        });
        return;
      }

      const res = await updateUser(userForm);
      if(res.error){
        toast({
          title: 'Error',
          description: res.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'User updated successfully.',
        });
      } 
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Errors = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setUserErrors(errors);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update user.',
          variant: 'destructive',
        });
      }
    } finally {
      setUserLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      newPasswordSchema.parse(passwordForm);
      setPasswordErrors({});
  
      const response = await updatePassword(passwordForm);
  
      if (response?.status === 'error') {
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: response.message,
        });
        setPasswordForm({
          newpassword: '',
          confirmpassword: '',
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Errors = {};
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
        setPasswordErrors(errors);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update password.',
          variant: 'destructive',
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await deleteUser();
      if (response?.status === 'error') {
        toast({
          title: 'Error',
          description: response?.message,
          variant: 'destructive',
        });
      } else {
        signOut({ callbackUrl: '/' });
        toast({
          title: 'Success',
          description: 'User deleted successfully.',
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive',
      });
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', 'dragging');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImage(file);
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="grid gap-8 md:gap-16 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your profile picture, name, and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleUserSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <div 
                className="flex items-center gap-4 cursor-pointer" 
                onDragOver={handleDragOver} 
                onDrop={handleDrop}
                draggable
                onDragStart={handleDragStart}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={image ? URL.createObjectURL(image) : userForm.image} />
                  <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Input id="avatar" type="file" onChange={handleImageChange} />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={userForm.username} onChange={handleUserChange} />
              {userErrors.username && <p className="text-destructive">{userErrors.username}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={userForm.email} onChange={handleUserChange} />
              {userErrors.email && <p className="text-destructive">{userErrors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profession">Profession</Label>
              <Input id="profession" type="text" value={userForm.profession} onChange={handleUserChange} />
              {userErrors.profession && <p className="text-destructive">{userErrors.profession}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" type="text" value={userForm.bio} onChange={handleUserChange} />
              {userErrors.bio && <p className="text-destructive">{userErrors.bio}</p>}
            </div>
            <Button disabled={uploading || userLoading} type="submit">
              {uploading || userLoading ? <><LoaderCircle className="w-4 h-4 animate-spin mr-2" />Loading</> : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handlePasswordChange}>
            <div className="grid gap-2">
              <Label htmlFor="newpassword">New Password</Label>
              <Password
                id="newpassword"
                placeholder="Enter your new password"
                value={passwordForm.newpassword}
                autoComplete="new-password"
                onChange={(e) => setPasswordForm({ ...passwordForm, newpassword: e.target.value })}
              />
              {passwordErrors.newpassword && <p className="text-destructive">{passwordErrors.newpassword}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmpassword">Confirm Password</Label>
              <Password
                id="confirmpassword"
                placeholder="Confirm your new password"
                value={passwordForm.confirmpassword}
                autoComplete="new-password"
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmpassword: e.target.value })}
              />
              {passwordErrors.confirmpassword && <p className="text-destructive">{passwordErrors.confirmpassword}</p>}
            </div>
            <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? <><LoaderCircle className="w-4 h-4 animate-spin mr-2" />Loading</> : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>Permanently delete your account and all your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
