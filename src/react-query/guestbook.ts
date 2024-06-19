import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { IGuestBook, IListQueryParams, IListResponse } from './types';

export const getGuestBookList = (params: IListQueryParams): Promise<AxiosResponse<IListResponse<IGuestBook>>> => {
  return axios.get('/api/guestbook', { params });
};

export const useGuestBookList = (params: IListQueryParams) =>
  useQuery({
    queryKey: ['guest-book-list', ...Object.values(params)],
    queryFn: () => getGuestBookList(params),
    select: (res) => res.data,
  });
