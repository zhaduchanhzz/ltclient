import { Metadata } from "next";

export const siteConfig = {
  name: "Luyện Thi VSTEP",
  description:
    "Hệ thống luyện thi VSTEP online hàng đầu Việt Nam. Ôn luyện 4 kỹ năng Listening, Reading, Speaking, Writing với ngân hàng câu hỏi phong phú và chấm thi tự động.",
  url: "https://luyenthivstep.vn",
  ogImage: "/images/luyenthivstep-og-image.png",
  author: "Luyện Thi VSTEP",
  keywords: [
    "VSTEP",
    "luyện thi VSTEP",
    "thi VSTEP online",
    "ôn thi VSTEP",
    "VSTEP B1",
    "VSTEP B2",
    "VSTEP C1",
    "chứng chỉ tiếng Anh",
    "thi tiếng Anh",
    "VSTEP listening",
    "VSTEP reading",
    "VSTEP speaking",
    "VSTEP writing",
  ],
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
  keywords = siteConfig.keywords,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  keywords?: string[];
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: keywords.join(", "),
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: siteConfig.url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@luyenthivstep",
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

// Helper function for article pages
export function constructArticleMetadata({
  title,
  description,
  author = siteConfig.author,
  publishedTime,
  modifiedTime,
  image = siteConfig.ogImage,
  slug,
}: {
  title: string;
  description: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
  slug: string;
}): Metadata {
  return {
    title,
    description,
    authors: [{ name: author }],
    openGraph: {
      type: "article",
      locale: "vi_VN",
      url: `${siteConfig.url}/vstep-article/${slug}`,
      title,
      description,
      siteName: siteConfig.name,
      publishedTime,
      modifiedTime,
      authors: [author],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@luyenthivstep",
    },
  };
}
