# SEO Implementation Guide

## Overview
This document outlines the SEO implementation for the Luyện Thi VSTEP Next.js application.

## What's Implemented

### 1. Essential SEO Files
- ✅ **robots.txt** - Located at `/public/robots.txt`
- ✅ **sitemap.ts** - Dynamic sitemap generation at `/src/app/sitemap.ts`
- ✅ **manifest.json** - PWA manifest at `/public/manifest.json`

### 2. Metadata System
- ✅ **Metadata utility** - `/src/utils/metadata.ts` provides:
  - `constructMetadata()` - For standard pages
  - `constructArticleMetadata()` - For article/blog pages
  - Automatic Open Graph and Twitter Card tags
  - Centralized site configuration

### 3. Structured Data
- ✅ **StructuredData component** - `/src/components/common/StructuredData/index.tsx`
- ✅ Organization schema
- ✅ Course schema helper
- ✅ FAQ schema helper
- ✅ Article schema helper

### 4. Open Graph Image
- ✅ **Dynamic OG image** - `/src/app/opengraph-image.tsx`
- Automatically generates social media preview images

### 5. Language Settings
- ✅ HTML lang attribute set to "vi" (Vietnamese)

## How to Use

### For Static Pages

```typescript
import { constructMetadata } from '@/utils/metadata'

export const metadata = constructMetadata({
  title: 'Your Page Title',
  description: 'A compelling description under 160 characters',
})
```

### For Dynamic Pages

```typescript
export async function generateMetadata({ params }) {
  const data = await fetchData(params.id)
  
  return constructMetadata({
    title: data.title,
    description: data.description,
    image: data.image,
  })
}
```

### Adding Structured Data

```typescript
import StructuredData, { organizationSchema } from '@/components/common/StructuredData'

export default function Page() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      {/* Page content */}
    </>
  )
}
```

## SEO Checklist for New Pages

1. [ ] Export metadata using `constructMetadata()`
2. [ ] Write unique, descriptive titles (50-60 characters)
3. [ ] Write compelling descriptions (150-160 characters)
4. [ ] Add relevant structured data
5. [ ] Ensure proper heading hierarchy (h1 → h2 → h3)
6. [ ] Add alt text to all images
7. [ ] Use semantic HTML elements
8. [ ] Implement internal linking where appropriate

## Best Practices

### Titles
- Include primary keyword
- Make it compelling and clickable
- Keep under 60 characters
- Include brand name using template

### Descriptions
- Summarize page content
- Include call-to-action
- Use target keywords naturally
- Keep between 150-160 characters

### Images
- Use descriptive file names
- Add alt text for accessibility
- Optimize file sizes
- Provide og:image for social sharing

### URLs
- Use descriptive slugs
- Keep URLs short and clean
- Use hyphens to separate words
- Avoid special characters

## Monitoring SEO

1. **Google Search Console** - Monitor indexing and search performance
2. **Google PageSpeed Insights** - Check Core Web Vitals
3. **Social Media Debuggers**:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

## Future Enhancements

1. [ ] Implement breadcrumb navigation with schema
2. [ ] Add language alternates for multi-language support
3. [ ] Create automated meta description generation
4. [ ] Implement review/rating schema for courses
5. [ ] Add video schema for tutorial content
6. [ ] Set up automated sitemap submission
7. [ ] Implement canonical URLs for duplicate content
8. [ ] Add RSS feed for articles

## Common Issues & Solutions

### Issue: Metadata not showing
**Solution**: Ensure the page is a server component or use `generateMetadata` for dynamic routes

### Issue: Social media preview not updating
**Solution**: Use social media debuggers to clear cache and re-scrape

### Issue: Sitemap not updating
**Solution**: The sitemap is generated dynamically on each request in production

### Issue: Structured data errors
**Solution**: Validate using Google's Rich Results Test tool