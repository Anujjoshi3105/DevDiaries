'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { File, UserIcon, TrendingUp, SearchIcon, Bookmark, Eye, Heart, MessageCircle, Link, SquareArrowOutUpRight, BookOpenIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { NumberFollowers, NumberFollowing, NumberBlogs, NumberLikes, NumberViews, NumberSaves, NumberTopics } from "@/action/stats";
import { getFollower, getFollowing } from "@/action/following";
import FollowButton from "@/components/blog/FollowButton";
import { getUserSavedBlogs } from "@/action/save";
import { Button } from "@/components/ui/button";
import { NumberOfComments } from "@/action/comment";

type Follower = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type Following = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type SavedBlog = { 
  id: string;
  createdAt: Date;
  blog: {
    id: string;
    title: string | null;
    content: string | null;
    topics: string[];
    image: string | null;
    publish: boolean;
    createdAt: Date;
    updatedAt: Date;
    views: number;
  };
};

export default function Page() {
  const { data: session } = useSession();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [followings, setFollowings] = useState<Following[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<SavedBlog[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [totalTopics, setTotalTopics] = useState(0);

  useEffect(() => {
    if (session?.user.id) {
      const fetchData = async () => {
        try {
          const blogsData = await NumberBlogs(session.user.id!);
          const likesData = await NumberLikes(session.user.id!);
          const viewsData = await NumberViews(session.user.id!);
          const topics = await NumberTopics(session.user.id!);
          const followers = await getFollower(session.user.id!);
          const followings = await getFollowing(session.user.id!);
          const savedBlogs = await getUserSavedBlogs(session.user.id!);
          const comments = await NumberOfComments(session.user.id!);

          setFollowers(followers.followers); // Ensure correct structure
          setFollowings(followings.following); // Ensure correct structure
          setSavedBlogs(savedBlogs.blogs);
          setTotalBlogs(blogsData.blogs);
          setTotalLikes(likesData.likes);
          setTotalViews(viewsData.views);
          setTotalTopics(topics.totalTopics);
          setTotalComments(comments?.response!);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [session]);

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--primary))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--primary) / 0.2)",
    },
  };

  return (
    <main className="flex-1 space-y-8 p-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4 hover:shadow-md">
        <CardContent className="flex items-center gap-4">
          <div className="bg-foreground p-3 rounded-full">
            <BookOpenIcon className="w-6 h-6 text-muted" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{totalBlogs}</h3>
            <p className="text-sm">Total Blogs</p>
          </div>
        </CardContent>
      </Card>
      <Card className="p-4 hover:shadow-md">
        <CardContent className="flex items-center gap-4">
          <div className="bg-foreground p-3 rounded-full">
            <MessageCircle className="w-6 h-6 text-muted" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{totalComments}</h3>
            <p className="text-sm">Total Comments</p>
          </div>
        </CardContent>
      </Card>
      <Card className="p-4 hover:shadow-md">
        <CardContent className="flex items-center gap-4">
          <div className="bg-foreground p-3 rounded-full">
            <Eye className="w-6 h-6 text-muted" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{totalViews}</h3>
            <p className="text-sm">Total Views</p>
          </div>
        </CardContent>
      </Card>
      <Card className="p-4 hover:shadow-md">
        <CardContent className="flex items-center gap-4">
          <div className="bg-foreground p-3 rounded-full">
            <Heart className="w-6 h-6 text-muted" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold">{totalLikes}</h3>
            <p className="text-sm">Total Likes</p>
          </div>
        </CardContent>
      </Card>

      </section>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="h-96 overflow-y-auto">
          <CardHeader>
            <CardTitle className="font-bold mb-2">Followers ({followers.length})</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {followers.length > 0 ? (
              followers.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between"> 
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={follower.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} />
                      <AvatarFallback>{follower.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">{follower.name}</p>
                      <p className="text-sm text-muted-foreground">{follower.email}</p>
                    </div>
                  </div>
                  <FollowButton authorId={follower.id} />
                </div>
              ))
            ) : (
              <p>No followers to display</p>
            )}
          </CardContent>
        </Card>
        <Card className="h-96 overflow-y-auto">
          <CardHeader>
            <CardTitle className="font-bold mb-2">Following ({followings.length})</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {followings.length > 0 ? (
              followings.map((following) => (
                <div key={following.id} className="flex items-center justify-between"> 
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={following.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} />
                      <AvatarFallback>{following.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">{following.name}</p>
                      <p className="text-sm text-muted-foreground">{following.email}</p>
                    </div>
                  </div>
                  <FollowButton authorId={following.id} />
                </div>
              ))
            ) : (
              <p>No following to display</p>
            )}
          </CardContent>
        </Card>
        <Card className="h-96 overflow-y-auto">
          <CardHeader>
            <CardTitle className="font-bold mb-2">Saved Blogs ({savedBlogs.length})</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {savedBlogs.length > 0 ? (
              savedBlogs.map((savedBlog) => (                
                <div key={savedBlog.id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                  <h3 className="text-lg font-medium">{savedBlog.blog.title}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(savedBlog.blog.createdAt).toLocaleDateString()}</p>
                </div>
                <Link href={`/blog/${savedBlog.id}`}>
                    <Button variant="outline" size="sm">
                      <SquareArrowOutUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p>No saved blogs to display</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart - Multiple</CardTitle>
            <CardContent>January - June 2024</CardContent>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <Tooltip />
                <Bar dataKey="desktop" fill={chartConfig.desktop.color} radius={4} />
                <Bar dataKey="mobile" fill={chartConfig.mobile.color} radius={4} />
              </BarChart>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
