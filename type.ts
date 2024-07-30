// types.ts

import { Prisma } from '@prisma/client';

export type Role = "USER" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date | null;
  image: string;
  password?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  bio?: string;
  profession?: string;
  accounts: Account[];
  blogs: Blog[];
  comments: Comment[];
  likes: Like[];
  saves: Save[];
  followers: Following[];
  following: Following[];
};

export type Account = {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export type VerificationToken = {
  id: string;
  email: string;
  token: string;
  expires: Date;
};

export type PasswordToken = {
  id: string;
  email: string;
  token: string;
  expires: Date;
};

export type Blog = {
  id: string;
  authorId: string;
  title?: string;
  content?: string;
  topics: string[];
  image?: string;
  publish: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  author: User;
  likes: Like[];
  comments: Comment[];
  saves: Save[];
};

export type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  blogId: string;
  parentCommentId?: string;
  user: User;
  blog: Blog;
  parentComment?: Comment;
  replies: Comment[];
  likes: Like[];
};

export type Like = {
  id: string;
  userId: string;
  blogId: string;
  commentId?: string;
  likeCount: number;
  user: User;
  blog: Blog;
  comment?: Comment;
};

export type Save = {
  id: string;
  createdAt: Date;
  userId: string;
  blogId: string;
  user: User;
  blog: Blog;
};

export type Following = {
  id: string;
  followerId: string;
  followingId: string;
  follower: User;
  following: User;
};
