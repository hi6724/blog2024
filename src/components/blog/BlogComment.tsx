import { formatDateWithDay } from '@/lib/date';
import { IComment } from '@/react-query/types';

function BlogCommentItem({ comment }: { comment: IComment }) {
  return (
    <div key={comment.id}>
      <div className='flex mb-2'>
        <div className='text-3xl mr-2'>{comment.icon}</div>
        <div>
          <div className='flex items-center'>
            <p className='text-sm font-bold mr-4'>{comment.username}</p>
          </div>
          <p className='text-xs font-thin text-base-content text-opacity-80'>
            {formatDateWithDay(comment.createdAt, { day: true, time: true })}
          </p>
        </div>
      </div>
      <div>
        <p>{comment.content}</p>
      </div>
    </div>
  );
}
export default BlogCommentItem;
