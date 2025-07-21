import { API_PATH } from "@/consts/api-path";
import HttpClient from "@/utils/axios-config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BlogPost, PageBlogPost, Pageable } from "../types/blog-posts";

export const useGetBlogPostsQuery = (
  pageable: Pageable = { page: 0, size: 10 },
  enabled = true,
) => {
  const { page = 0, size = 10, sort = [] } = pageable;

  return useQuery({
    queryKey: [API_PATH.BLOG_POSTS, pageable],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());

      if (sort.length > 0) {
        sort.forEach((s) => params.append("sort", s));
      }

      return HttpClient.get<null, PageBlogPost>(
        `${API_PATH.BLOG_POSTS}?${params.toString()}`,
      );
    },
    enabled,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });
};

export const useGetBlogPostByIdQuery = (id: number, enabled = true) => {
  return useQuery({
    queryKey: [API_PATH.BLOG_POSTS, id],
    queryFn: () => {
      return HttpClient.get<null, BlogPost>(`${API_PATH.BLOG_POSTS}/${id}`);
    },
    enabled: enabled && !!id,
  });
};

export const useCreateBlogPostMutation = () => {
  return useMutation({
    mutationFn: (data: Partial<BlogPost>) => {
      return HttpClient.post<Partial<BlogPost>, BlogPost>(
        API_PATH.BLOG_POSTS,
        data,
      );
    },
  });
};

export const useUpdateBlogPostMutation = () => {
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<BlogPost> & { id: number }) => {
      return HttpClient.put<Partial<BlogPost>, BlogPost>(
        `${API_PATH.BLOG_POSTS}/${id}`,
        data,
      );
    },
  });
};

export const useDeleteBlogPostMutation = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return HttpClient.delete<null, void>(`${API_PATH.BLOG_POSTS}/${id}`);
    },
  });
};

export const useTogglePinBlogPostMutation = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return HttpClient.patch<null, BlogPost>(
        `${API_PATH.BLOG_POSTS}/pin/${id}`,
      );
    },
  });
};
