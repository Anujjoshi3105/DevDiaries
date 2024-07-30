import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart } from 'lucide-react';

interface BlogCardProps {
  variant?: 'primary' | 'secondary';
  imageSrc?: string;
  imageAlt?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  authorName?: string;
  date: Date;
  title: string;
  tags?: string[];
  description?: string;
  link?: string;
  views?: number;
  likes?: number;
}

const BlogCard: FC<BlogCardProps> = ({
  variant = 'primary',
  imageSrc,
  imageAlt,
  avatarSrc,
  avatarAlt,
  authorName,
  date,
  title,
  tags = [],
  description,
  link = '#',
  views,
  likes,
}) => (
  <Link href={link}>
    <Card className={`${variant === 'secondary' ? 'flex flex-col md:flex-row gap-4 items-start p-4' : 'group'} hover:shadow-md`}>
      {imageSrc && (
        <div className={`${variant === 'secondary' ? 'flex-shrink-0 overflow-hidden md:rounded-l-lg h-full min-h-52 w-full md:w-52' : 'rounded-t-md overflow-hidden aspect-[16/9] mb-4'}`}>
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            width={200}
            height={200}
            className="object-cover h-full w-full transition-transform duration-300 ease-in-out transform group-hover:scale-110"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className={`${variant === 'secondary' ? 'text-base mb-2 text-muted-foreground' : 'flex items-center gap-2 text-xs text-muted-foreground'}`}>
          {avatarSrc && (
            <Avatar className="w-6 h-6">
              <AvatarImage src={avatarSrc} alt={avatarAlt} />
              <AvatarFallback>{authorName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          {authorName && <span>{authorName}</span>}
          {authorName && <span>•</span>}
          <time className="text-xs">{new Date(date).toLocaleDateString()}</time>
        </div>
        <h2 className={`${variant === 'secondary' ? 'text-xl font-bold my-1' : 'text-lg font-medium my-2'}`}>{title}</h2>
        <div className="flex gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {description && (
          <p className="text-sm py-4 text-muted-foreground">
            <ReactMarkdown>{description.substring(0, 50)}</ReactMarkdown>
          </p>
        )}
        {variant !== 'secondary' && (
          <div className="flex items-center justify-between text-sm py-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{views} views</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span>{likes} likes</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </Link>
);

export default BlogCard;
