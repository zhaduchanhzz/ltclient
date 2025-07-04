import BlogDetail from "@/components/features/home/blog-detail";

type BlogDetailPageProps = {
  params: Promise<{ id: string }>;
};

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const resolvedParams = await params;
  const blogId = parseInt(resolvedParams.id, 10);

  if (isNaN(blogId)) {
    return <div>Invalid blog ID</div>;
  }

  return <BlogDetail blogId={blogId} />;
};

export default BlogDetailPage;