export type BlogPost = {
  id: number;
  title: string;
  content: string;
  summary?: string;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
  relatedBlogPosts?: BlogPost[];
};

// API uses standard Spring Page response
export type PageBlogPost = {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: BlogPost[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  empty: boolean;
};

export type Pageable = {
  page?: number;
  size?: number;
  sort?: string[];
  searchTerm?: string;
};
