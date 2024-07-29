"use client";
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { likeCount, likeCountByUser, toggleLike } from '@/action/likes';
import { HeartIcon } from 'lucide-react';

interface LikeButtonProps {
  blogId: string;
  commentId?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ blogId, commentId }) => {
  const [likes, setLikes] = useState<number>(0);
  const [userLike, setUserLike] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      if (!blogId && !commentId) return; // Handle the case where no IDs are provided
      
      const totalLikes = await likeCount(blogId, commentId);
      const userLikes = await likeCountByUser(blogId, commentId);
      setLikes(totalLikes);
      setUserLike(userLikes > 0);
    }
    fetchData();
  }, [blogId, commentId]);

  const handleLike = async () => {
    try {
      const newLikeStatus = await toggleLike(blogId, commentId);
      setUserLike(newLikeStatus);
      setLikes(prev => Math.max(prev + (newLikeStatus ? 1 : -1), 0));
      if(newLikeStatus) {
        toast({
          title: "Success",
          description: "Like added successfully.",
        }); 
      } else {
        toast({
          title: "Success",
          description: "Like removed successfully.",
        });
      }
    } catch (error: any) {
      if (error.message) {
        toast({
          title: "Error",
          description: "You must be logged in to like.",
          variant: "destructive",
        });
      } else {
        console.error(error);
      }
    }
  };

  return (
    <button onClick={handleLike} className="flex items-center justify-center gap-2 text-sm">
        <HeartIcon className={userLike ? 'fill-destructive text-destructive' : 'hover:fill-destructive'} />
        {likes}
    </button>
  );
};

export default LikeButton;
