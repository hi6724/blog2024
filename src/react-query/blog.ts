import { CONTENT_STALE_MS } from '@/lib/cache-policy';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { IBlogOverview, IListQueryParams, IListResponse } from './types';
import { formatSearchParams } from '@/lib/params';

export const getBlogList = async (params: IListQueryParams) => {
  return await (await fetch(`/api/blog?${formatSearchParams(params)}`)).json();
};

export const useBlogOverviewList = (params: IListQueryParams) =>
  useInfiniteQuery<IListResponse<IBlogOverview>>({
    staleTime: CONTENT_STALE_MS,
    queryKey: ['blog-ovreview-list', ...Object.values(params)],
    // @ts-ignore
    queryFn: ({ pageParam }) => getBlogList({ ...params, ...(!!pageParam && { cursor: pageParam }) }),
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => lastPage.next_cursor,
  });

export const getNextPrevBlog = async (cursor: string) => {
  const nextPreview = await getBlogList({ cursor, page_size: 2, sort: 'descending' });
  const prevPreview = await getBlogList({ cursor, page_size: 2, sort: 'ascending' });
  return { next: nextPreview?.results?.[1], prev: prevPreview?.results?.[1] };
};

export const getBlogTags = async () => {
  return await (await fetch('/api/blog/tags')).json();
};
export const useBlogTags = () =>
  useQuery<{ name: string; color: string }[]>({
    staleTime: CONTENT_STALE_MS,
    queryKey: ['blog-tags'],
    queryFn: getBlogTags,
  });

export const useNextPrevBlogOverview = (id: string) =>
  useQuery<{ next?: IBlogOverview; prev?: IBlogOverview }>({
    staleTime: CONTENT_STALE_MS,
    queryKey: ['next-prev-blog', id],
    queryFn: () => getNextPrevBlog(id),
  });
