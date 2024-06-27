import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { IListQueryParams, IListResponse, IProjectOverView } from './types';
import { formatSearchParams } from '@/lib/params';

export const getProjectList = async (params: IListQueryParams) => {
  const data = await (await fetch(`/api/project?${formatSearchParams(params)}`)).json();
  return data;
};

export const useProjectOverviewList = (params: IListQueryParams) =>
  useInfiniteQuery<IListResponse<IProjectOverView>>({
    queryKey: ['project-ovreview-list', ...Object.values(params)],
    // @ts-ignore
    queryFn: ({ pageParam }) => getProjectList({ ...params, ...(!!pageParam && { cursor: pageParam }) }),
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => lastPage.next_cursor,
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
