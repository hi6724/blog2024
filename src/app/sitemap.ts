import type { MetadataRoute } from 'next';

async function fetchData(url: string) {
  const res = await fetch(`https://hunmogu.com/${url}`);
  return await res.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: 'https://hunmogu.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://hunmogu.com/about-me',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://hunmogu.com/project',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: 'https://hunmogu.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
    {
      url: 'https://hunmogu.com/guestbook',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.4,
    },
    ...(await fetchData('api/blog-ids')).map((o: any) => ({
      url: `https://hunmogu.com/blog/${o.id}`,
      lastModified: o.lastEditedTime,
      priority: 0.3,
    })),

    ...(await fetchData('api/project-ids')).map((o: any) => ({
      url: `https://hunmogu.com/project/${o.id}`,
      lastModified: o.lastEditedTime,
      priority: 0.3,
    })),
  ];
}
