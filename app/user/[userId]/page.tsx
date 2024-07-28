import { Metadata } from 'next';
import { getUserByName } from '@/action/user';
import NotFound from '@/app/not-found';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import FollowButton from '@/components/blog/FollowButton';

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
    const user = await getUserByName(params.userId);
    return {
        title: user?.name || 'User Not Found',
        description: user?.bio?.substring(0, 160) || 'User description',
    };
}

interface PageProps {
    params: {
        userId: string;
    };
}

export default async function Page({ params }: PageProps) {
    const user = await getUserByName(params.userId);

    if (!user) {
        return <NotFound Heading="User Not Found" />;
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <Avatar className="w-24 h-24 md:w-32 md:h-32">
                    <AvatarImage src={user.image || '/logo.png'} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    {user.profession &&
                        <p className="text-muted-foreground">{user.profession}</p>
                    }
                    <FollowButton authorId={user.id} />
                </div>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <h2 className="text-2xl font-bold">About Me</h2>
                    <p className="text-muted-foreground">
                        {user.bio ? user.bio : "No bio available"}
                    </p>
                </div>
                {user.blogs && user.blogs.length > 0 ? (
                    <div className="grid gap-4">
                        <h2 className="text-2xl font-bold">My Blog Posts</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {user.blogs.map((blog) => (
                                <Card key={blog.id}>
                                    <CardHeader>
                                        <h3 className="text-lg font-semibold">{blog.title}</h3>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{blog?.content?.substring(0, 100)}...</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Link href={`/blogs/${blog.id}`} className="text-blue-600 hover:underline">
                                            Read more
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-2">
                        <h2 className="text-2xl font-bold">My Blog Posts</h2>
                        <p className="text-muted-foreground">No blog posts available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
