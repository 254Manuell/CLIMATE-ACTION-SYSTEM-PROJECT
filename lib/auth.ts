import { z } from 'zod';

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Validation schemas
const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private tokenExpiryDays = 7;

  private constructor() {
    // Try to restore user session
    this.restoreSession();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private restoreSession() {
    if (typeof window === 'undefined') return;

    const token = this.getToken();
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch {
        this.clearSession();
      }
    }
  }

  private setToken(token: string) {
    const expires = new Date();
    expires.setDate(expires.getDate() + this.tokenExpiryDays);
    document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    localStorage.setItem('auth_token', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private clearSession() {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      // Validate input
      emailSchema.parse(email);
      passwordSchema.parse(password);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const { access_token } = await response.json();

      // Get user data
      const userResponse = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }

      this.currentUser = await userResponse.json();
      this.setToken(access_token);
      localStorage.setItem('user_data', JSON.stringify(this.currentUser));

      return this.currentUser;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  async signup(data: SignupData): Promise<User> {
    try {
      // Validate input
      emailSchema.parse(data.email);
      passwordSchema.parse(data.password);
      nameSchema.parse(data.name);

      // Call backend API
      // Convert to form data for signup
      const formData = new URLSearchParams();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('full_name', data.name);

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }

      const { access_token } = await response.json();

      // Get user data
      const userResponse = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }

      this.currentUser = await userResponse.json();
      this.setToken(access_token);
      localStorage.setItem('user_data', JSON.stringify(this.currentUser));

      return this.currentUser;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    this.clearSession();
  }

  async resetPassword(email: string): Promise<void> {
    try {
      // Validate email
      emailSchema.parse(email);

      // Call backend API
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Password reset failed');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message);
      }
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const authService = AuthService.getInstance();