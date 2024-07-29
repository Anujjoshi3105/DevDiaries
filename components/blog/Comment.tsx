"use client";

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { getAllComments, createComment, deleteComment, updateComment } from '@/action/comment';
import LikeButton from './LikeButton';

interface User {
    id: string;
    name: string;
    image: string | null;
}

interface Blog {
    id: string;
    title: string | null;
    authorId: string;
}

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    blogId: string;
    parentCommentId?: string | null;
    user: User;
    blog: Blog;
    replies: {
        id: string;
        content: string;
        createdAt: Date;
        userId: string;
        blogId: string;
        parentCommentId: string | null;
        user: User;
    }[];
}


export default function CommentSection({ blogId }: { blogId: string }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<string>('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<string>('');
    const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
    const [replyFormData, setReplyFormData] = useState<string>('');

    const fetchCommentData = useCallback(async () => {
        setLoading(true);
        try {
            const { response, error } = await getAllComments(blogId);
            if (response) {
                setComments(response);
            } else {
                toast({ title: 'Error', description: error || 'Failed to fetch comments', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to fetch comments', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    }, [blogId]);

    useEffect(() => {
        fetchCommentData();
    }, [fetchCommentData]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.trim()) {
            toast({ title: 'Error', description: 'Comment cannot be empty', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            await createComment(blogId, formData);
            setFormData('');
            toast({ title: 'Success', description: 'Comment added' });
            fetchCommentData();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to add comment', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editFormData.trim()) {
            toast({ title: 'Error', description: 'Comment cannot be empty', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            await updateComment(editingCommentId!, editFormData);
            setEditingCommentId(null);
            setEditFormData('');
            toast({ title: 'Success', description: 'Comment updated' });
            fetchCommentData();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update comment', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        setLoading(true);
        try {
            await deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
            toast({ title: 'Success', description: 'Comment deleted' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete comment', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: FormEvent<HTMLFormElement>, parentCommentId: string) => {
        e.preventDefault();
        if (!replyFormData.trim()) {
            toast({ title: 'Error', description: 'Reply cannot be empty', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            await createComment(blogId, replyFormData, parentCommentId);
            setReplyFormData('');
            setReplyingCommentId(null);
            toast({ title: 'Success', description: 'Reply added' });
            fetchCommentData();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to add reply', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    function timeSince(createdAt: Date) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInMs = now.getTime() - createdDate.getTime();

        const seconds = Math.floor(diffInMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
        }
    }

    return (
        <div className="grid gap-6">
            <form onSubmit={handleSubmit} className="grid w-full gap-2">
                <Textarea
                    placeholder="Type your comment here."
                    value={formData}
                    onChange={(e) => setFormData(e.target.value)}
                    disabled={loading}
                />
                <Button size="sm" type="submit" disabled={loading}>Post Comment</Button>
            </form>

            <h2 className="font-semibold text-xl">All Comments ({comments.filter(comment => comment.parentCommentId === null).length})</h2>
            {loading ? (
                <p>Loading comments...</p>
            ) : (
                comments.filter(comment => comment.parentCommentId === null).map((comment) => (
                    <div key={comment.id} className="text-sm flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                            {comment.user.image ? (
                                <AvatarImage src={comment.user.image} alt={comment.user.name} />
                            ) : (
                                <AvatarFallback>{comment.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                            )}
                        </Avatar>
                        <div className="grid gap-1.5 w-full">
                            <div className="flex items-center gap-2">
                                <div className="font-semibold">@{comment.user.name}</div>
                                <div className="text-xs">{timeSince(comment.createdAt)}</div>
                            </div>
                            {editingCommentId === comment.id ? (
                                <form onSubmit={handleUpdate} className="flex gap-2 w-full">
                                    <Textarea
                                        value={editFormData}
                                        onChange={(e) => setEditFormData(e.target.value)}
                                        disabled={loading}
                                    />
                                    <Button size="sm" type="submit" disabled={loading}>Update</Button>
                                    <Button size="sm" variant="secondary" onClick={() => setEditingCommentId(null)} disabled={loading}>Cancel</Button>
                                </form>
                            ) : (
                                <div>{comment.content}</div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                <LikeButton blogId={blogId} commentId={comment.id} />
                                                            
                                {session?.user?.id === comment.user.id && (
                                    <>
                                        <Button size="sm" variant="secondary" onClick={() => setEditingCommentId(comment.id)} disabled={loading}>Edit</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(comment.id)} disabled={loading}>Delete</Button>
                                    </>
                                )}
                                <Button size="sm" variant="secondary" onClick={() => setReplyingCommentId(comment.id)} disabled={loading}>Reply</Button>
                            </div>
                            {replyingCommentId === comment.id && (
                                <form onSubmit={(e) => handleReply(e, comment.id)} className="flex gap-2 w-full mt-2">
                                    <Textarea
                                        placeholder="Type your reply here."
                                        value={replyFormData}
                                        onChange={(e) => setReplyFormData(e.target.value)}
                                        disabled={loading}
                                    />
                                    <Button size="sm" type="submit" disabled={loading}>Post Reply</Button>
                                    <Button size="sm" variant="secondary" onClick={() => setReplyingCommentId(null)} disabled={loading}>Cancel</Button>
                                </form>
                            )}

                            {/* Render replies */}
                            {comment.replies.length > 0 && (
                                <div className="ml-6 mt-2">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="text-sm flex items-start gap-4">
                                            <Avatar className="w-8 h-8">
                                                { reply?.user?.image ? (
                                                    <AvatarImage src={reply.user.image} alt={reply.user.name} />
                                                ) : (
                                                    <AvatarFallback>{reply.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="grid gap-1.5 w-full">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-semibold">@{reply.user.name}</div>
                                                    <div className="text-xs">{timeSince(reply.createdAt)}</div>
                                                </div>
                                                {editingCommentId === reply.id ? (
                                                    <form onSubmit={handleUpdate} className="flex gap-2 w-full">
                                                        <Textarea
                                                            value={editFormData}
                                                            onChange={(e) => setEditFormData(e.target.value)}
                                                            disabled={loading}
                                                        />
                                                        <Button size="sm" type="submit" disabled={loading}>Update</Button>
                                                        <Button size="sm" variant="secondary" onClick={() => setEditingCommentId(null)} disabled={loading}>Cancel</Button>
                                                    </form>
                                                ) : (
                                                    <div>{reply.content}</div>
                                                )}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <LikeButton blogId={blogId} commentId={reply.id} />
                                                    
                                                    {session?.user?.id === reply.user.id && (
                                                        <>
                                                            <Button size="sm" variant="secondary" onClick={() => setEditingCommentId(reply.id)} disabled={loading}>Edit</Button>
                                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(reply.id)} disabled={loading}>Delete</Button>
                                                        </>
                                                    )}
                                                    <Button size="sm" variant="secondary" onClick={() => setReplyingCommentId(reply.id)} disabled={loading}>Reply</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
