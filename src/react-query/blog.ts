import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { IBlogOverview, IListQueryParams, IListResponse } from './types';

export const getBlogList = (params: IListQueryParams): Promise<AxiosResponse<IListResponse<IBlogOverview>>> => {
  return axios.get('/api/blog', { params });
};

export const useBlogOverviewList = (params: IListQueryParams) =>
  useQuery({
    queryKey: ['blog-ovreview-list', ...Object.values(params)],
    queryFn: () => getBlogList(params),
    select: (res) => res.data,
  });
