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
  likes: { id: string }[]; // Updated to match actual structure
  createdAt: Date; // Use string for ISO date format
  topics: string[];
}

const LoadingSkeleton = () => {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-4">Most Recent Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-muted-foreground h-48 w-full rounded-lg animate-pulse"></div>
        ))}
      </div>
    </section>
  );
};

export default function Recent() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blog', {
          params: {
            quantity: 8,
            sort: 'createdAt_desc', // Sort by newest
            page: 1
          }
        });
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-4">Most Recent Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            link={`/blog/${blog.id}`}
            title={blog.title}
            imageSrc={blog.image || '/logo.png'}
            date={blog.createdAt} 
            tags={blog.topics}
            authorName={blog.author.name}
            avatarSrc={blog.author.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            avatarAlt={blog.author.name}
            likes={blog.likes.length}
            views={blog.views}
          />
        ))}
      </div>
    </section>
  );
}
