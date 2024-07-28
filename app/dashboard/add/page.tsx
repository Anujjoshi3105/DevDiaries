'use client';

import React, { useState } from 'react';
import BlogForm from '@/components/blog/Form';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createBlog } from '@/action/blog';
import { BlogSchema } from '@/schemas';

export default function AddBlog() {
  const [initialFormData] = useState({
    title: '',
    content: '',
    topics: [],
    image: '',
  });
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      const validate = BlogSchema.safeParse(formData);
      if (!validate.success) {
        toast({
          title: 'Error',
          description: validate.error.message,
          variant: 'destructive',
        });
        return;
      }

      const response = await createBlog( formData );
      if (!response.blog)  {
        toast({
          title: 'Failed to create blog',
          description: response.message  || 'Please try again later.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Blog created successfully',
          description: 'Your blog has been created.',
        });
        router.push(`/blog/${response.blog.id}`);
      }
    } catch (error: any) {
      console.error('Error creating blog:', error.message);
      toast({
        title: 'Error',
        description: `An unexpected error occurred. ${error.message || 'Please try again later.'}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Create a New Blog</h2>
        <p className="text-muted-foreground">Share your thoughts and ideas with the world</p>
      </div>
      <BlogForm formData={initialFormData} handleSubmit={handleSubmit} />
    </div>
  );
}