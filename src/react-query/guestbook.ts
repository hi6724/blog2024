import { INTERACTION_STALE_MS } from '@/lib/cache-policy';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { IGuestBook, IListQueryParams, IListResponse } from './types';
import { formatSearchParams } from '@/lib/params';

export const getGuestBookList = async (params: IListQueryParams) => {
  const response = await fetch(`/api/guestbook?${formatSearchParams(params)}`, { cache: 'no-store' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? '방명록을 불러오지 못했습니다.');
  return data;
};

export const useGuestBookList = (params: IListQueryParams) =>
  useInfiniteQuery<IListResponse<IGuestBook>>({
    staleTime: INTERACTION_STALE_MS,
    queryKey: ['guest-book-list', ...Object.values(params)],
    // @ts-ignore
    queryFn: ({ pageParam }) => getGuestBookList({ ...params, ...(!!pageParam && { cursor: pageParam }) }),
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => lastPage.next_cursor,
  });

export function useGuestbookCount(initialData?: number) {
  return useQuery<number>({
    queryKey: ['guestbook-count'], staleTime: INTERACTION_STALE_MS,
    initialData, initialDataUpdatedAt: 0,
    queryFn: async () => {
      const response = await fetch('/api/guestbook/count', { cache: 'no-store' });
      if (!response.ok) throw new Error('방명록 개수를 불러오지 못했습니다.');
      return response.json();
    },
  });
}
export function useInvalidateGuestbook() {
  const cache = useQueryClient();
  return async () => {
    await cache.cancelQueries({ queryKey: ['guest-book-list'] });
    await cache.cancelQueries({ queryKey: ['guestbook-count'] });
    return Promise.all([
    cache.invalidateQueries({ queryKey: ['guest-book-list'] }),
    cache.invalidateQueries({ queryKey: ['guestbook-count'] }),
    ]);
  };
}
