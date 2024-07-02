'use client';
import { IBlogOverview } from '@/react-query/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function BlogItem({ data }: { data: IBlogOverview }) {
  const router = useRouter();
  const createdAt = dayjs(data.createdAt);
  const today = dayjs();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className='card card-compact sm:card-normal w-full shadow-xl shadow-base-content/40 cursor-pointer'
      onClick={() => router.push(`/blog/${data.id}`)}
      whileHover={{
        scale: 1.05,
      }}
    >
      {data.thumbImageUri && (
        <figure className='h-32 hidden'>
          <Image src={data.thumbImageUri} alt='thumbImageUri' width={400} height={400} className='w-full' />
        </figure>
      )}
      <div className='card-body justify-end'>
        {/* title */}
        <h2 className='card-title'>{data.title}</h2>
        {/* contents */}
        <div>
          <p className='line-clamp-2'>{data.overview}</p>
        </div>
        <div className='divider my-1'></div>
        {/* tags */}
        <div className='flex gap-1'>
          {data.tags.map((tag: string, i: number) => (
            <div className='badge badge-accent badge-outline' key={i}>
              {tag}
            </div>
          ))}
        </div>
        {/* footer */}
        <p className='text-sm font-semibold opacity-40 flex-grow-0'>
          {createdAt.format(createdAt.get('year') !== today.get('year') ? 'YYYY년 M월 D일' : 'M월 D일')}
        </p>
      </div>
    </motion.div>
  );
}

export default BlogItem;
