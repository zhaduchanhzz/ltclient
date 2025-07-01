export type BlogPost = {
  id: string;
  title: string;
  content: string;
  description: string;
  thumbnail?: string;
  category: string;
  slug: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogPostsResponse = {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type BlogPostFilters = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
};
