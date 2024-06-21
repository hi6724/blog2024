import { useQuery } from '@tanstack/react-query';
import { IGuestBook, IListQueryParams, IListResponse } from './types';
import { formatSearchParams } from '@/lib/params';

export const getGuestBookList = async (params: IListQueryParams): Promise<IListResponse<IGuestBook>> => {
  const data = await (await fetch(`/api/guestbook?${formatSearchParams(formatSearchParams)}`)).json();
  return data;
};

export const useGuestBookList = (params: IListQueryParams) =>
  useQuery({
    queryKey: ['guest-book-list', ...Object.values(params)],
    queryFn: () => getGuestBookList(params),
  });
