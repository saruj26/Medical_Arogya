// lib/auth.ts

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = sessionStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('token');
};

export const getUserRole = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('userRole');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('userId');
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};