// Server TTLs are seconds; React Query staleTime is milliseconds.
export const CONTENT_CACHE_SECONDS = 60 * 60;
export const INTERACTION_CACHE_SECONDS = 10 * 60;
export const CONTENT_STALE_MS = 10 * 60 * 1000;
export const INTERACTION_STALE_MS = 5 * 60 * 1000;
export const GUESTBOOK_CACHE_TAG = 'guestbook';
export const COMMENT_COUNTS_CACHE_TAG = 'comment-counts';
export const commentCacheTag = (postId: string) => `comments:${postId}`;
