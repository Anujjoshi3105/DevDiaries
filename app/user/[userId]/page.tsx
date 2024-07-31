import { Metadata } from 'next';
import { getUserByName } from '@/action/user';
import NotFound from '@/app/not-found';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import FollowButton from '@/components/blog/FollowButton';
import { NumberFollowers, NumberFollowing, NumberTopics } from '@/action/stats';
import { Badge } from '@/components/ui/badge';
import BlogCard from '@/components/BlogCard';

export async function generateMetadata({ params }: { params: { userId: string } }): Promise<Metadata> {
    const user = await getUserByName(params.userId);
    const topics = await NumberTopics(params.userId);
    const topicKeywords = topics.topics.join(', ');

    return {
        title: user?.name || 'User Not Found',
        description: user?.bio?.substring(0, 160) || 'User description',
        keywords: topicKeywords,
    };
}

export default async function Page({ params }: { params: { userId: string } }) {
    const user = await getUserByName(params.userId);
    const totalFollower = await NumberFollowers(user?.id!);
    const totalFollowing = await NumberFollowing(user?.id!);
    const topics = await NumberTopics(params.userId).then((result) => result.topics);

    if (!user) {
        return <NotFound Heading="User Not Found" />;
    }

    return (
        <div className="w-full max-w-3xl sm:max-w-5xl mx-auto">
            <div className="bg-muted rounded-t-lg">
                <div className="relative h-40 md:h-56 overflow-hidden rounded-t-lg">
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-muted to-transparent">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20 border-4 border-background">
                                <AvatarImage src={user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{user.name}</h2>
                                <p className="text-sm text-muted-foreground">{user.profession || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-background rounded-b-lg p-6 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-lg sm:text-2xl font-semibold">About</h3>
                    <p className="text-muted-foreground">
                        {user.bio || '-'}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-16">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{totalFollower.followers}</span>
                            <span className="text-sm text-muted-foreground">Followers</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{totalFollowing.following}</span>
                            <span className="text-sm text-muted-foreground">Following</span>
                        </div>
                    </div>
                    <FollowButton authorId={user.id} />
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-2xl font-semibold">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                        {topics.map((topic) => (
                            <Badge key={topic} className="text-sm text-nowrap bg-muted rounded-full px-3 py-1">
                                {topic}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg sm:text-2xl font-semibold">Blog Posts</h3>
                    {user.blogs && user.blogs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {user.blogs.map((blog) => (
                                <BlogCard
                                key={blog.id}
                                link={`/blog/${blog.id}`}
                                title={blog.title || 'Untitled'}
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
                    ) : (
                        <div className="text-muted-foreground">No blog posts available</div>
                    )}
                </div>
            </div>
        </div>
    );
}
