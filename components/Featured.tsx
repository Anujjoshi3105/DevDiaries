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
    <section className="container bg-muted py-6 md:py-12 rounded-lg mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main BlogCard Skeleton */}
        <div className="bg-muted-foreground h-64 w-full rounded-lg animate-pulse"></div>
        {/* Additional BlogCards Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-muted-foreground h-48 w-full rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-muted-foreground h-48 w-full rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Featured() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blog', {
          params: {
            quantity: 8, // Fetch 8 most viewed blogs
            sort: 'views_desc', // Sort by views in descending order
          },
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
    <section className="container bg-muted py-6 md:py-12 rounded-lg mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main BlogCard */}
        {blogs.length > 0 && (
          <BlogCard
            imageSrc={blogs[0].image || '/logo.png'}
            imageAlt={blogs[0].title}
            avatarSrc={blogs[0].author.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            avatarAlt={blogs[0].author.name}
            authorName={blogs[0].author.name}
            description={blogs[0].content}
            date={blogs[0].createdAt}
            title={blogs[0].title}
            tags={blogs[0].topics}
            link={`/blog/${blogs[0].id}`}
            likes={blogs[0].likes.length}
            views={blogs[0].views}
          />
        )}
        {/* Additional BlogCards */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.slice(1, 3).map(blog => (
              <BlogCard
                key={blog.id}
                imageSrc={blog.image || '/logo.png'}
                imageAlt={blog.title}
                avatarSrc={blog.author.image || '/logo.png'}
                avatarAlt={blog.author.name}
                authorName={blog.author.name}
                date={blog.createdAt}
                title={blog.title}
                tags={blog.topics}
                link={`/blog/${blog.id}`}
                likes={blog.likes.length}
                views={blog.views}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.slice(3, 5).map(blog => (
              <BlogCard
                key={blog.id}
                imageSrc={blog.image || '/logo.png'}
                imageAlt={blog.title}
                avatarSrc={blog.author.image || '/logo.png'}
                avatarAlt={blog.author.name}
                authorName={blog.author.name}
                date={blog.createdAt}
                title={blog.title}
                tags={blog.topics}
                link={`/blog/${blog.id}`}
                likes={blog.likes.length}
                views={blog.views}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
