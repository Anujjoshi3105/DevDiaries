'use client';

import React from 'react';
import BlogForm from '@/components/blog/Form';

export default function EditBlog({ params }: { params: { blogId: string } }) {
  const { blogId } = params;

  return (
    <div className="container mx-auto max-w-3xl p-4 text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Edit Blog</h2>
        <p className="text-muted-foreground">Update your blog details</p>
      </div>
      <BlogForm blogId={blogId} />
    </div>
  );
}
