"use client"

import React from 'react';
import { format } from 'date-fns';
import { blogService } from '@/lib/blog';
import { authService } from '@/lib/auth';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string | null;
}

interface BlogPostProps {
  post: BlogPost;
  onDelete?: (id: number) => void;
}

export function BlogPost({ post, onDelete }: BlogPostProps) {
  const currentUser = authService.getCurrentUser();
  const canDelete = currentUser?.id === post.author_id || currentUser?.is_superuser;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await blogService.deletePost(post.id);
      onDelete?.(post.id);
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  return (
    <article className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <div className="text-gray-600 mb-4">
        <span>Posted on {format(new Date(post.created_at), 'MMM d, yyyy')}</span>
        {post.updated_at && (
          <>
            <span className="mx-2">•</span>
            <span>Updated on {format(new Date(post.updated_at), 'MMM d, yyyy')}</span>
          </>
        )}
      </div>
      <div className="prose max-w-none mb-4 whitespace-pre-wrap">
        {post.content}
      </div>
      {canDelete && (
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete Post
        </button>
      )}
    </article>
  );
}
