// Example implementation for dynamic article pages with SEO
// Copy this pattern when implementing the actual article pages

import { constructArticleMetadata } from "@/utils/metadata";
import StructuredData, {
  createArticleSchema,
} from "@/components/common/StructuredData";
import { notFound } from "next/navigation";

// This would fetch article data from your API
async function getArticle(slug: string) {
  // Replace with actual API call
  const article = {
    title: "Cách học VSTEP hiệu quả",
    description:
      "Hướng dẫn chi tiết cách học và ôn thi VSTEP hiệu quả để đạt chứng chỉ B1, B2, C1",
    content: "...",
    author: "Luyện Thi VSTEP",
    publishedAt: "2025-01-04T10:00:00Z",
    updatedAt: "2025-01-04T10:00:00Z",
    image: "/images/article-thumbnail.jpg",
    slug: slug,
  };

  return article;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  if (!article) {
    return {};
  }

  return constructArticleMetadata({
    title: article.title,
    description: article.description,
    author: article.author,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    image: article.image,
    slug: article.slug,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const articleSchema = createArticleSchema({
    title: article.title,
    description: article.description,
    author: article.author,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: `https://luyenthivstep.vn${article.image}`,
    url: `https://luyenthivstep.vn/vstep-article/${article.slug}`,
  });

  return (
    <>
      <StructuredData data={articleSchema} />
      <article>
        <h1>{article.title}</h1>
        <div>{article.content}</div>
      </article>
    </>
  );
}
