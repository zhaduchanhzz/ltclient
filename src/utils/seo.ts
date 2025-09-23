import { Metadata } from "next";

// Default site configuration
export const siteConfig = {
  name: "VSTEP Luyện Thi",
  url: "https://luyenthivstep.vn",
  description:
    "Hệ thống luyện thi VSTEP online với đầy đủ 4 kỹ năng Listening, Reading, Speaking, Writing. Đề thi chuẩn, chấm điểm tự động, phản hồi chi tiết.",
  keywords: [
    "VSTEP",
    "luyện thi VSTEP",
    "thi VSTEP online",
    "ôn thi VSTEP",
    "VSTEP B1",
    "VSTEP B2",
    "VSTEP C1",
    "tiếng Anh VSTEP",
    "đề thi VSTEP",
  ],
  author: "VSTEP Luyện Thi",
  ogImage: "/opengraph-image",
};

// Helper function to generate page metadata
export function generatePageMetadata({
  title,
  description,
  keywords,
  path = "",
  images,
  type = "website",
}: {
  title: string;
  description: string;
  keywords?: string | string[];
  path?: string;
  images?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  type?: "website" | "article";
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const keywordString = Array.isArray(keywords)
    ? keywords.join(", ")
    : keywords || siteConfig.keywords.join(", ");

  const ogImages = images || [
    {
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  ];

  return {
    title,
    description,
    keywords: keywordString,
    authors: [{ name: siteConfig.author }],
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: siteConfig.name,
      locale: "vi_VN",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Helper to generate JSON-LD structured data
export function generateArticleStructuredData({
  title,
  description,
  content,
  publishedTime,
  modifiedTime,
  url,
  images = [],
}: {
  title: string;
  description: string;
  content: string;
  publishedTime: string;
  modifiedTime: string;
  url: string;
  images?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    articleBody: content.replace(/<[^>]*>/g, ""), // Remove HTML tags
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      "@type": "Organization",
      name: siteConfig.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.svg`,
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image:
      images.length > 0 ? images : [`${siteConfig.url}${siteConfig.ogImage}`],
  };
}

// Helper to generate Organization structured data
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: `${siteConfig.url}/logo.svg`,
    sameAs: [
      // Add social media URLs when available
      // "https://www.facebook.com/vstepluyenthi",
      // "https://www.youtube.com/@vstepluyenthi",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
      addressLocality: "Việt Nam",
    },
  };
}

// Helper to generate Course structured data
export function generateCourseStructuredData({
  name,
  description,
  provider = siteConfig.name,
  url,
}: {
  name: string;
  description: string;
  provider?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      sameAs: siteConfig.url,
    },
    url,
    courseMode: "online",
    educationalLevel: "B1, B2, C1",
    teaches: "VSTEP English Proficiency Test Preparation",
    inLanguage: "vi",
  };
}

// Helper to strip HTML tags and truncate text
export function generateMetaDescription(
  content: string,
  maxLength: number = 160,
): string {
  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, "");

  // Remove extra whitespace
  const cleanedContent = textContent.replace(/\s+/g, " ").trim();

  // Truncate if necessary
  if (cleanedContent.length <= maxLength) {
    return cleanedContent;
  }

  // Truncate at word boundary
  const truncated = cleanedContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength - 20) {
    return truncated.substring(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
}
