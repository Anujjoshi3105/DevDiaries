'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '@/app/firebase';
import { Progress } from '@/components/ui/progress';
import { BlogSchema } from '@/schemas';
import Image from 'next/image';
import Tag from '@/components/ui/tag';

interface BlogFormProps {
  formData: {
    title: string;
    content: string;
    topics: string[];
    image: string;
  };
  handleSubmit: (data: any) => Promise<void>;
}

type FormData = z.infer<typeof BlogSchema>;

export default function BlogForm({ formData, handleSubmit }: BlogFormProps) {
  const { register, handleSubmit: handleFormSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: formData,
    resolver: zodResolver(BlogSchema),
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const mdParser = new MarkdownIt();
  const localFormData = watch();
  const [submit, setSubmit] = useState(false);

  const handleTagsChange = (tags: string[]) => {
    setValue('topics', tags);
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setValue('content', text);
  };

  const handleImageUpload = (file: File): Promise<string> => {
    setUploadingImage(true);
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {
          setUploadingImage(false);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadingImage(false);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const image = await handleImageUpload(file);
        setValue('image', image);
        toast({
          title: 'Image uploaded',
          description: 'The image URL has been set.',
        });
      } catch (error: any) {
        toast({
          title: 'Upload Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmit(true);
    try {
      await handleSubmit(data);
      reset(formData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmit(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleFormSubmit(onSubmit)}>
      <div className="grid gap-2">
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <Input
          id="title"
          type="text"
          placeholder="Enter your post title"
          {...register("title")}
        />
        {errors.title && <span className="text-destructive text-sm">{errors.title.message}</span>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="topics" className="block text-sm font-medium">Topics</label>
        <Tag onTagsChange={handleTagsChange} />
        {errors.topics && <span className="text-destructive text-sm">{errors.topics.message}</span>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="imageUpload" className="block text-sm font-medium">Thumbnail</label>
        {localFormData.image && (
          <Image src={localFormData.image} width={200} height={200} alt="Thumbnail Preview" className="w-full h-[200px] object-cover" />
        )}
        <Input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUploadChange}
        />
        {uploadingImage && <Progress value={progress} className="h-1" />}
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium">Content</label>
        <MdEditor
          value={localFormData.content}
          className="w-full h-[500px]"
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
          onImageUpload={async (file: File) => {
            const image = await handleImageUpload(file);
            return image;
          }}
        />
        {errors.content && <span className="text-destructive text-sm">{errors.content.message}</span>}
      </div>

      <Button type="submit" className="w-full flex gap-1" disabled={uploadingImage || submit}>
        {uploadingImage || submit ? <><LoaderCircle className="w-4 h-4 animate-spin" />Loading</> : 'Submit'}
      </Button>
    </form>
  );
}
