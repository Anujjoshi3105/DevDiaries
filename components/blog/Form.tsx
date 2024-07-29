'use client';

import React, { useEffect, useState } from 'react';
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
import { getBlog, updateBlog, createBlog } from '@/action/blog';
import { useRouter } from 'next/navigation';

type FormData = z.infer<typeof BlogSchema>;

export default function BlogForm({ blogId }: { blogId?: string }) {
  const { register, handleSubmit: handleFormSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      title: '',
      content: '',
      topics: [],
      image: '',
    },
    resolver: zodResolver(BlogSchema),
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const mdParser = new MarkdownIt();
  const localFormData = watch();
  const [submit, setSubmit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (blogId) {
      const fetchBlogData = async () => {
        try {
          const response = await getBlog(blogId);
          if (response.blog) {
            reset({
              title: response.blog.title!,
              content: response.blog.content!,
              topics: response.blog.topics!,
              image: response.blog.image!,
            });
          }
        } catch (error) {
          console.error('Error fetching blog data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load blog data.',
            variant: 'destructive',
          });
        }
      };

      fetchBlogData();
    }
  }, [blogId, reset, toast]);

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
      const validate = BlogSchema.safeParse(data);
      if (!validate.success) {
        toast({
          title: 'Error',
          description: validate.error.message,
          variant: 'destructive',
        });
        setSubmit(false);
        return;
      }

      console.log(data);
      console.log(register);
      
      let response;
      if (blogId) {
        response = await updateBlog(blogId, data);
      } else {
        response = await createBlog(data);
      }

      if (!response.blog) {
        toast({
          title: `Failed to ${blogId ? 'update' : 'create'} blog`,
          description: response.message || 'Please try again later.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: `Blog ${blogId ? 'updated' : 'created'} successfully`,
          description: `Your blog has been ${blogId ? 'updated' : 'created'}.`,
        });
        router.push(`/blog/${response.blog.id}`);
      }
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
        <Tag initialTags={localFormData.topics} onTagsChange={handleTagsChange} />
        {errors.topics && <span className="text-destructive text-sm">{errors.topics.message}</span>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="image" className="block text-sm font-medium">Image</label>
        <Input
          id="image"
          type="file"
          onChange={handleImageUploadChange}
          accept="image/*"
        />
        {uploadingImage && <Progress value={progress} />}
        {localFormData.image && (
          <div className="relative h-52 w-full">
            <Image
              src={localFormData.image}
              alt="Uploaded"
              fill
              className="rounded-md"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        {errors.image && <span className="text-destructive text-sm">{errors.image.message}</span>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="content" className="block text-sm font-medium">Content</label>
        <MdEditor
          id="content"
          value={localFormData.content}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
          className="h-96"
        />
        {errors.content && <span className="text-destructive text-sm">{errors.content.message}</span>}
      </div>

      <Button type="submit" disabled={submit}>
        {submit && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        {blogId ? 'Update' : 'Create'} Blog
      </Button>
    </form>
  );
}
