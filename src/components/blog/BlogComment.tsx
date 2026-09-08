import { formatDateWithDay } from '@/lib/date';
import { IComment } from '@/react-query/types';
import type { ReactNode } from 'react';

function BlogCommentItem({ comment, actions }: { comment: IComment; actions?: ReactNode }) {
  return (
    <div className='min-w-0'>
      <div className='mb-4 flex items-center gap-3'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-base-200 text-2xl' aria-hidden='true'>{comment.icon}</div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-3'>
            <p className='min-w-0 break-words text-sm font-semibold'>{comment.username}</p>
            {actions}
          </div>
          <time dateTime={comment.createdAt} className='mt-1 block text-xs leading-relaxed text-base-content/60'>
            {formatDateWithDay(comment.createdAt, { day: true, time: true })}
          </time>
        </div>
      </div>
      <div>
        <p className='whitespace-pre-wrap break-words text-sm leading-7 text-base-content/90 sm:text-base'>{comment.content}</p>
      </div>
    </div>
  );
}
export default BlogCommentItem;
