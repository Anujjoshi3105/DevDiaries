"use client";
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { CheckSaved, toggleSave } from '@/action/save';
import { Bookmark } from 'lucide-react';

interface SaveButtonProps {
  blogId: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ blogId }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSavedStatus() {
      try {
        const { Status } = await CheckSaved(blogId);
        setIsSaved(Status);
      } catch (error: any) {
          console.error(error);
      }
    }
    fetchSavedStatus();
  }, [blogId]);

  const handleSaveToggle = async () => {
    try {
      const newSaveStatus = await toggleSave(blogId);
      setIsSaved(newSaveStatus);
      if(newSaveStatus) {
        toast({
          title: "Success",
          description: "Blog saved successfully.",
        });
      } else {
        toast({
          title: "Success",
          description: "Blog unsaved successfully.",
        });
      }
    } catch (error: any) {
      if (error.message) {
        toast({
          title: "Error",
          description: "You must be logged in to save.",
          variant: "destructive",
        });
      } else {
        console.error(error);
      }
    }
  };

  return (
    <button onClick={handleSaveToggle} aria-label="Save Button">
      {<Bookmark className={isSaved ? 'fill-foreground' : "hover:fill-foreground"} />}
    </button>
  );
};

export default SaveButton;
