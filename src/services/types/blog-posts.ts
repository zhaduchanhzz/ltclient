export type BlogPost = {
  id: number;
  title: string;
  content: string;
  description?: string;
  summary?: string;
  thumbnail?: string;
  category?: string;
  slug: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
  relatedBlogPosts?: BlogPost[];
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
