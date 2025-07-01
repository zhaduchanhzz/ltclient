import { API_PATH } from "@/consts/api-path";
import { useMutation, useQuery } from "@tanstack/react-query";
import HttpClient from "@/utils/axios-config";
import { CommonResponse } from "@/types/common";
import {
  BlogPost,
  BlogPostsResponse,
  BlogPostFilters,
  BlogPostCategory,
} from "../types/blog-posts";

export const useGetBlogPostsQuery = (
  filters: BlogPostFilters = {},
  enabled = true,
) => {
  const { search, category, page = 1, limit = 12 } = filters;

  return useQuery({
    queryKey: [API_PATH.BLOG_POSTS, filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      return HttpClient.get<null, CommonResponse<BlogPostsResponse>>(
        `${API_PATH.BLOG_POSTS}?${params.toString()}`,
      );
    },
    enabled,
  });
};

export const useGetBlogPostCategoriesQuery = (enabled = true) => {
  return useQuery({
    queryKey: [`${API_PATH.BLOG_POSTS}/categories`],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<BlogPostCategory[]>>(
        `${API_PATH.BLOG_POSTS}/categories`,
      );
    },
    enabled,
  });
};

export const useGetBlogPostBySlugQuery = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: [`${API_PATH.BLOG_POSTS}/slug`, slug],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<BlogPost>>(
        `${API_PATH.BLOG_POSTS}/slug/${slug}`,
      );
    },
    enabled: enabled && !!slug,
  });
};

export const useCreateBlogPostMutation = () => {
  return useMutation({
    mutationFn: (data: BlogPost) => {
      return HttpClient.post<BlogPost, CommonResponse<BlogPost>>(
        API_PATH.BLOG_POSTS,
        data,
      );
    },
  });
};

export const useUpdateBlogPostMutation = () => {
  return useMutation({
    mutationFn: (data: BlogPost) => {
      return HttpClient.put<BlogPost, CommonResponse<BlogPost>>(
        API_PATH.BLOG_POSTS,
        data,
      );
    },
  });
};

export const useDeleteBlogPostMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return HttpClient.delete<null, CommonResponse<null>>(
        `${API_PATH.BLOG_POSTS}/${id}`,
      );
    },
  });
};

export const usePinBlogPostMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return HttpClient.put<null, CommonResponse<null>>(
        `${API_PATH.BLOG_POSTS}/${id}/pin`,
      );
    },
  });
};

export const useUnpinBlogPostMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return HttpClient.put<null, CommonResponse<null>>(
        `${API_PATH.BLOG_POSTS}/${id}/unpin`,
      );
    },
  });
};
