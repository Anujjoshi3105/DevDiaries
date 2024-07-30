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
  createdAt: Date;
  topics: string[];
}

const LoadingSkeleton = () => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Popular&apos;s Choice</h2>
      <div className="flex lg:flex-col overflow-x-auto gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex flex-col gap-2 p-4 bg-muted-foreground rounded-lg animate-pulse w-60">
            <div className="h-32 bg-muted-foreground rounded"></div>
            <div className="h-4 bg-muted-foreground rounded w-3/4"></div>
            <div className="h-4 bg-muted-foreground rounded w-1/2"></div>
            <div className="h-4 bg-muted-foreground rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function Popular() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blog', {
          params: {
            quantity: 8,
            sort: 'views_desc',
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

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Popular&apos;s Choice</h2>
      <div className="flex lg:flex-col overflow-x-auto gap-4">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              link={`/blog/${blog.id}`}
              title={blog.title}
              date={blog.createdAt}
              tags={blog.topics}
              authorName={blog.author.name}
              avatarSrc={blog.author.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              avatarAlt={blog.author.name}
              likes={blog.likes.length}
              views={blog.views}
            />
          ))
        )}
      </div>
    </section>
  );
}
