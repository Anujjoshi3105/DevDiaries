"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { FilterIcon, SearchIcon } from 'lucide-react';
import { NumberTopics } from '@/action/stats';
import BlogCard from './BlogCard';
import { Badge } from './ui/badge';

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

const SearchBlog: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    search: '',
    topics: [] as string[],
    quantity: '10',
    sort: 'createdAt_desc',
  });
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [topics, setTopics] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(10);

  const handleSearch = useCallback(async (page = currentPage) => {
    try {
      const params = new URLSearchParams({
        search: searchParams.search,
        quantity: quantity.toString(),
        sort: searchParams.sort,
        page: page.toString(),
      });

      searchParams.topics.forEach(topic => params.append('topics', topic));

      const response = await axios.get('/api/blog?' + params.toString());
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching blogs', error);
    }
  }, [currentPage, quantity, searchParams]);

  useEffect(() => {
    const fetchTopics = async () => {
      const result = await NumberTopics();
      setTopics(result.topics);
    };
    fetchTopics();
    handleSearch();
  }, [handleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      search: e.target.value,
    });
  };

  const handleTagClick = (tag: string) => {
    setSearchParams(prevParams => {
      const newTopics = prevParams.topics.includes(tag)
        ? prevParams.topics.filter(t => t !== tag)
        : [...prevParams.topics, tag];
      return { ...prevParams, topics: newTopics };
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchParams, quantity, currentPage, handleSearch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-background border-b px-4 md:px-6 flex items-center h-16 shrink-0">
        <div className="flex relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" onClick={() => handleSearch()} />
          <Input
            type="search"
            placeholder="Search blog posts..."
            className="p-8 pr-4 py-2"
            value={searchParams.search}
            onChange={handleInputChange}
          />
          <span className="sr-only">Search</span>
        </div>
        <div className="flex gap-2">
          <div className="ml-4 flex items-center">
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="border rounded-md px-2 py-1 w-16"
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="ml-4">
              <FilterIcon className="h-5 w-5" />
              <span className="sr-only">Filters</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={searchParams.sort}
              onValueChange={(value) => setSearchParams({ ...searchParams, sort: value })}
            >
              <DropdownMenuRadioItem value="createdAt_desc">Newest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="createdAt_asc">Oldest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="views_desc">Most Viewed</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className='font-bold'>
              TOPICS
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  variant={searchParams.topics.includes(topic) ? "default" : "outline"}
                  onClick={() => handleTagClick(topic)}
                  className="cursor-pointer"
                >
                  {topic}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">Showing {blogs.length} results</p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {blogs.map((blog) => (
              <BlogCard 
                key={blog.id}
                link={`/blog/${blog.id}`}
                title={blog.title}
                description={blog.content}
                imageSrc={blog.image || '/logo.png'}
                date={blog.createdAt}
                tags={blog.topics}
                authorName={blog.author.name}
                avatarSrc={blog.author.image || '/logo.png'}
                avatarAlt={blog.author.name}
                likes={blog.likes.length}
                views={blog.views}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => handleSearch(currentPage - 1)} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={() => handleSearch(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => handleSearch(currentPage + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchBlog;
