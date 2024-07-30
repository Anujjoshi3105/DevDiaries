'use client';

import React from 'react';
import BlogForm from '@/components/blog/Form';

export default function AddBlog() {
  return (
    <div className="container mx-auto max-w-3xl p-4 text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Create a New Blog</h2>
        <p className="text-muted-foreground">Share your thoughts and ideas with the world</p>
      </div>
      <BlogForm />
    </div>
  );
}