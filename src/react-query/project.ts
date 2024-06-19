import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { IListQueryParams, IListResponse, IProjectOverView } from './types';

export const getProjectList = (params: IListQueryParams): Promise<AxiosResponse<IListResponse<IProjectOverView>>> => {
  return axios.get('/api/project', { params });
};

export const useProjectOverviewList = (params: IListQueryParams) =>
  useQuery({
    queryKey: ['project-ovreview-list', ...Object.values(params)],
    queryFn: () => getProjectList(params),
    select: (res) => res.data,
  });
