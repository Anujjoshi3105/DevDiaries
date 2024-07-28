'use client';

import React, { useState, useEffect } from 'react';
import BlogForm from '@/components/blog/Form';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface BlogFormData {
  title: string;
  content: string;
  topics: string[];
  image: string;
}


export default function EditBlog({ params }: { params: { blogId: string } }) {
  const { blogId } = params;
  const [initialFormData, setInitialFormData] = useState<BlogFormData | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`/api/blog?blogId=${blogId}`);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch blog data');
        }
        setInitialFormData({
          title: data.blog.title,
          content: data.blog.content,
          topics: data.blog.topics,
          image: data.blog.image,
        });
      } catch (error) {
        console.error('Error fetching blog data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog data.',
          variant: 'destructive',
        });
      }
    };

    fetchBlogData();
  }, [blogId, toast]);

  const handleSubmit = async (formData: BlogFormData) => {
    try {
      const response = await fetch(`/api/blog?blogId=${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        toast({
          title: 'Failed to update blog',
          description: result.message || 'Please try again later.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Blog updated successfully',
          description: 'Your blog has been updated.',
        });
        router.push(`/blog/${blogId}`);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (!initialFormData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl p-4 text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Edit Blog</h2>
        <p className="text-muted-foreground">Update your blog details</p>
      </div>
      <BlogForm formData={initialFormData} handleSubmit={handleSubmit} />
    </div>
  );
}
