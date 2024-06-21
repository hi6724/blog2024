import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { IBlogOverview, IListQueryParams, IListResponse } from './types';
import { formatSearchParams } from '@/lib/params';

export const getBlogList = async (params: IListQueryParams): Promise<IListResponse<IBlogOverview>> => {
  return await (await fetch(`/api/blog?${formatSearchParams(params)}`)).json();
};

export const useBlogOverviewList = (params: IListQueryParams) =>
  useQuery({
    queryKey: ['blog-ovreview-list', ...Object.values(params)],
    queryFn: () => getBlogList(params),
  });
