import { API_PATH } from "@/consts/api-path";
import { useMutation, useQuery } from "@tanstack/react-query";
import HttpClient from "@/utils/axios-config";
import { CommonResponse } from "@/types/common";
import { BlogPost } from "../types/blog-posts";

export const useGetBlogPostsQuery = (enabled = false) => {
  return useQuery({
    queryKey: [API_PATH.BLOG_POSTS],
    queryFn: () => {
      return HttpClient.get<null, CommonResponse<BlogPost[]>>(
        API_PATH.BLOG_POSTS,
      );
    },
    enabled,
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
