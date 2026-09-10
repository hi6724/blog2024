import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { fetchSitemapPages } from '@/lib/sitemap-pages';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, projects] = await Promise.all([
    fetchSitemapPages('8a3bdeb10ce94834a5ba6a8476f4d43c'),
    fetchSitemapPages('68009bd6df9640f9b09322eb70a3dee5'),
  ]);

  // Static pages have no reliable modification date; omit rather than invent it.
  return [
    ...['', '/about-me', '/project', '/blog', '/guestbook'].map((path) => ({ url: `${SITE_URL}${path}` })),
    ...blogs.map((page) => ({ url: `${SITE_URL}/blog/${page.id}`, lastModified: page.lastEditedTime })),
    ...projects.map((page) => ({ url: `${SITE_URL}/project/${page.id}`, lastModified: page.lastEditedTime })),
  ];
}
