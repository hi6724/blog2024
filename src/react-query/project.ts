import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { IListQueryParams, IListResponse, IProjectOverView } from './types';
import { formatSearchParams } from '@/lib/params';
import { unstable_cache as nextCache } from 'next/cache';

export const cacheProjectList = nextCache((params) => getProjectList(params), ['project-ovreview-list']);
export const getProjectList = async (params: IListQueryParams): Promise<IListResponse<IProjectOverView>> => {
  const data = await (await fetch(`/api/project?${formatSearchParams(params)}`, { next: { revalidate: 3600 } })).json();
  return data;
};

export const useProjectOverviewList = (params: IListQueryParams) =>
  useQuery({
    queryKey: ['project-ovreview-list', ...Object.values(params)],
    queryFn: () => getProjectList(params),
  });

export const getProjectDetail = async (id: string) => {
  const data = await (await fetch(`/api/project/${id}`)).json();
  return data;
};

export const useProjectDetail = (id: string) =>
  useQuery({
    queryKey: ['project-detail', id],
    queryFn: () => getProjectDetail(id),
  });
