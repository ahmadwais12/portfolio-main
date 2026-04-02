import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Project = {
  id?: string;
  title: string;
  description: string;
  long_description: string;
  image: string;
  tags: string[];
  category: 'web' | 'mobile' | 'design';
  favorite: boolean;
  github_url: string;
  demo_url: string;
  created_at?: string;
  updated_at?: string;
};

export type Skill = {
  id?: string;
  name: string;
  category: string;
  level: number;
  created_at?: string;
};

export type Testimonial = {
  id?: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  created_at?: string;
};

export type Service = {
  id?: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  created_at?: string;
};

export type Profile = {
  id?: string;
  full_name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatar_url: string;
  resume_url: string;
  social_links: {
    github: string;
    linkedin: string;
    twitter: string;
    portfolio: string;
  };
  updated_at?: string;
};
