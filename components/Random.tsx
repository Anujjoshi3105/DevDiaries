"use client";

import BlogCard from "./BlogCard";
import { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  id: string;
  title: string;
  content: string;
  image: string | null;
  author: {
    name: string;
    image: string | null;
  };
  views: number;
  likes: {
    length: number;
  }[];
  createdAt: Date;
  topics: string[];
}

const LoadingSkeleton = () => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Random Post</h2>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex flex-col gap-2 p-4 bg-gray-300 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-400 rounded w-1/4"></div>
          <div className="h-8 bg-gray-400 rounded w-3/4"></div>
          <div className="h-4 bg-gray-400 rounded w-1/2"></div>
        </div>
      ))}
    </section>
  );
};

export default function Random() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blog'); // Replace with your API endpoint
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Random Post</h2>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            variant="secondary"
            date={blog.createdAt}
            title={blog.title}
            tags={blog.topics}
            description={blog.content}
            imageSrc={blog.image || '/logo.png'}
            imageAlt={blog.title}
          />
        ))
      )}
    </section>
  );
}
