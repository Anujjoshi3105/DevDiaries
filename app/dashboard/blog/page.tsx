"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrashIcon, FilePenIcon, SearchIcon, SquareArrowOutUpRight, LinkIcon } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { deleteBlog, getBlog, togglePublish } from "@/action/blog";
import { likeCount } from "@/action/likes";
import LinkButton from "@/components/blog/LinkButton";

type Blog = {
  id: string;
  authorId: string;
  title: string | null;
  content: string | null;
  topics: string[];
  image: string | null;
  publish: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: number; // Include likes property in the Blog type
};

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await getBlog();
    if (response.blogs) {
      const blogsWithLikes = await Promise.all(
        response.blogs.map(async (blog: Omit<Blog, 'likes'>) => {
          const likes = await likeCount(blog.id);
          return { ...blog, likes };
        })
      );
      setBlogs(blogsWithLikes);
    } else {
      toast({
        title: "Error",
        description: response.message || "Failed to fetch blogs",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (blogId: string) => {
    const response = await deleteBlog(blogId);
    if (response.message) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Blog deleted successfully",
        description: "Your blog has been deleted.",
      });
      fetchBlogs();
    }
  };

  const handlePublish = async (blogId: string) => {
    const response = await togglePublish(blogId); // Use the correct function
    if (response.message) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Blog ${response.blog?.publish ? 'published' : 'unpublished'} successfully`,
        description: `Your blog has been ${response.blog?.publish ? 'published' : 'unpublished'}.`,
      });
      fetchBlogs();
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full overflow-auto p-4">
      <div className="relative ml-auto flex-1 mb-4">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full rounded-lg bg-background pl-8"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBlogs.map(blog => (
            <TableRow key={blog.id}>
              <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                {blog.image && <Image src={blog.image} alt={blog.title || "Blog Image"} width={50} height={50} />}
              </TableCell>
              <TableCell>{blog.title}</TableCell>
              <TableCell>
                <Button variant={blog.publish ? "default" : "outline"} size="sm" onClick={() => handlePublish(blog.id)}>
                  {blog.publish ? "Publish" : "Draft"}
                </Button>
              </TableCell>
              <TableCell className="space-x-2">
                {blog.topics.map((topic, index) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                {blog.likes}
              </TableCell>
              <TableCell className="flex justify-center space-x-2">
                <Link href={`/blog/${blog.id}`} prefetch={false}>
                  <Button variant="outline" size="sm">
                    <SquareArrowOutUpRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <LinkButton blogId={blog.id} />
                </Button>
                <Link href={`/dashboard/edit/${blog.id}`}>
                  <Button variant="outline" size="sm">
                    <FilePenIcon className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" className="bg-destructive" size="sm" onClick={() => handleDelete(blog.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
