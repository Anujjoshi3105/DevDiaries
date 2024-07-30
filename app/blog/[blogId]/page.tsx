import { Metadata } from 'next';
import { getBlog } from '@/action/blog';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import LikeButton from '@/components/blog/LikeButton';
import SaveButton from '@/components/blog/SaveButton';
import LinkButton from '@/components/blog/LinkButton';
import FollowButton from '@/components/blog/FollowButton';
import CommentSection from '@/components/blog/Comment';
import { Timer } from 'lucide-react';
import { getReadTime } from '@/lib/helper';
export async function generateMetadata({ params }: { params: { blogId: string } }): Promise<Metadata> {
  const data = await getBlog(params.blogId);
  return {
    title: data.blog?.title || 'Blog Not Found',
    description: data.blog?.content?.substring(0, 160) || 'Blog description',
  };
}

export default async function BlogPage({ params }: { params: { blogId: string } }) {
  const data = await getBlog(params.blogId);
  const blog = data.blog;
  if (!blog) {
    return <div>Error: Blog not found</div>;
  }

  return (
    <main className="lg:px-20 md:px-10 px-4 py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold">{blog.title}</h1>
          <div className="flex gap-2 my-6">
            {blog.topics && blog.topics.map((topic) => (
              <Badge key={topic} className="text-xs text-nowrap">
                {topic}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Avatar className="w-12 h-12">
              <AvatarImage src={blog?.author?.image||'/logo.png'} alt={blog?.author?.name} />
              <AvatarFallback>{blog?.author?.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-sm space-y-1">
              <div className="flex items-center gap-4">
                <Link href={`/user/${blog?.author?.name}`} className="font-bold hover:underline">{blog?.author?.name}</Link> 
                <FollowButton authorId={blog?.author?.id} />
              </div>
              <p>{new Date(blog.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="border-y-[1px] border-foreground/10 p-3 mt-6 flex items-center justify-between">
            <LikeButton blogId={blog.id} />
            <div className='flex items-center gap-2'>
              <Timer /> {getReadTime(blog.content || "")} read
            </div>
            <div className="flex justify-center items-center gap-3">
              <SaveButton blogId={blog.id} />
              <LinkButton blogId={blog.id} />
            </div>  
          </div>
          <div className="prose text-foreground max-w-none mx-auto py-8">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
          <CommentSection blogId={blog.id} />
        </div>
      </main>
  );
}
