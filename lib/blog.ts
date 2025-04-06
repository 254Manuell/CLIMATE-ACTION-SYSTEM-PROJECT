import { z } from 'zod';
import { authService } from './auth';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string | null;
}

interface CreateBlogPost {
  title: string;
  content: string;
}

// Validation schemas
const titleSchema = z.string().min(1, 'Title is required').max(255, 'Title is too long');
const contentSchema = z.string().min(1, 'Content is required');

class BlogService {
  private static instance: BlogService;
  private baseUrl = 'http://localhost:8000/api/v1/blog';

  private constructor() {}

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  async getAllPosts(): Promise<BlogPost[]> {
    const response = await fetch(this.baseUrl, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch blog posts');
    }

    return response.json();
  }

  async getPost(id: number): Promise<BlogPost> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch blog post');
    }

    return response.json();
  }

  async createPost(data: CreateBlogPost): Promise<BlogPost> {
    try {
      // Validate input
      titleSchema.parse(data.title);
      contentSchema.parse(data.content);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create blog post');
      }

      return response.json();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete blog post');
    }
  }
}

export const blogService = BlogService.getInstance();
