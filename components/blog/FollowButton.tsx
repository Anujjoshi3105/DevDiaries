"use client";

import { CheckFollowing, toggleFollow } from '@/action/following';
import React, { useEffect, useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Badge } from '../ui/badge';

interface FollowButtonProps {
  authorId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ authorId }) => {
  const [followed, setFollowed] = useState<boolean>(false);

  useEffect(() => {
    const fetchFollowedStatus = async () => {
      try {
        const res = await CheckFollowing(authorId);
        if (res?.ifFollowing !== undefined) {
          setFollowed(res.ifFollowing);
        }
      } catch (error: any) {
        if (error.message === "No user found") {
          toast({
            title: "Error",
            description: "You must be logged in to check following status.",
            variant: "destructive",
          });
        } else {
          console.error("Error fetching followed status:", error);
        }
      }
    };
    fetchFollowedStatus();
  }, [authorId]);

  const handleFollowToggle = async () => {
    try {
      const newFollowStatus = await toggleFollow(authorId);
      setFollowed(newFollowStatus);
      if (newFollowStatus) {
        toast({
          title: "Success",
          description: "You are now following this author.",
        });
      } else {
        toast({
          title: "Success",
          description: "You are no longer following this author.",
        });
      }
    } catch (error: any) {
      if (error.message === "No user found") {
        toast({
          title: "Error",
          description: "You must be logged in to follow.",
          variant: "destructive",
        });
      } else {
        console.error("Error toggling follow status:", error);
      }
    }
  };

  return (
    <Badge variant={followed ? "outline": "default"} className="cursor-pointer w-fit" onClick={handleFollowToggle}>                
      {followed ? 'Following' : 'Follow'}
    </Badge>
  );
};

export default FollowButton;
