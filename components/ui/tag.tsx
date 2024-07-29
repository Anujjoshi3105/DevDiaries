'use client';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';

const Tag = ({ initialTags = [], onTagsChange }: { initialTags?: string[], onTagsChange: (tags: string[]) => void }) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState<string>('');

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onTagsChange(newTags);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onTagsChange(newTags);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mt-1">
        {tags.map((tag, index) => (
          <Badge key={index}>
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="ml-2">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex mt-2">
        <Input
          type="text"
          placeholder="Add topics"
          value={tagInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" className="ml-2" onClick={addTag} disabled={!tagInput.trim()}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default Tag;
