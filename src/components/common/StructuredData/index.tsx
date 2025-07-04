import Script from "next/script";

interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Luyện Thi VSTEP",
  url: "https://luyenthivstep.vn",
  logo: "https://luyenthivstep.vn/images/luyenthivstep-logo.png",
  description: "Hệ thống luyện thi VSTEP online hàng đầu Việt Nam",
  address: {
    "@type": "PostalAddress",
    addressCountry: "VN",
    addressLocality: "Việt Nam",
  },
  sameAs: [
    "https://facebook.com/luyenthivstep",
    "https://youtube.com/luyenthivstep",
  ],
};

// Course Schema
export function createCourseSchema({
  name,
  description,
  price,
  priceCurrency = "VND",
}: {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "Luyện Thi VSTEP",
      sameAs: "https://luyenthivstep.vn",
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
      availability: "https://schema.org/InStock",
    },
  };
}

// FAQ Schema
export function createFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Article Schema
export function createArticleSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
}: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified: string;
  image: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished,
    dateModified,
    image,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: {
      "@type": "Organization",
      name: "Luyện Thi VSTEP",
      logo: {
        "@type": "ImageObject",
        url: "https://luyenthivstep.vn/images/luyenthivstep-logo.png",
      },
    },
  };
}
