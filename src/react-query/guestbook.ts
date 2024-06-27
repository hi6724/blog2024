import { useInfiniteQuery } from '@tanstack/react-query';
import { IGuestBook, IListQueryParams, IListResponse } from './types';
import { formatSearchParams } from '@/lib/params';

export const getGuestBookList = async (params: IListQueryParams) => {
  const data = await (await fetch(`/api/guestbook?${formatSearchParams(params)}`)).json();
  return data;
};

export const useGuestBookList = (params: IListQueryParams) =>
  useInfiniteQuery<IListResponse<IGuestBook>>({
    queryKey: ['guest-book-list', ...Object.values(params)],
    // @ts-ignore
    queryFn: ({ pageParam }) => getGuestBookList({ ...params, ...(!!pageParam && { cursor: pageParam }) }),
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => lastPage.next_cursor,
  });
