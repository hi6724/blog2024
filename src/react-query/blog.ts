import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { IBlogOverview, IListQueryParams, IListResponse } from './types';
import { formatSearchParams } from '@/lib/params';

export const getBlogList = async (params: IListQueryParams) => {
  return await (await fetch(`/api/blog?${formatSearchParams(params)}`)).json();
};

export const useBlogOverviewList = (params: IListQueryParams) =>
  useInfiniteQuery<IListResponse<IBlogOverview>>({
    queryKey: ['blog-ovreview-list', ...Object.values(params)],
    // @ts-ignore
    queryFn: ({ pageParam }) => getBlogList({ ...params, ...(!!pageParam && { cursor: pageParam }) }),
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => lastPage.next_cursor,
  });
