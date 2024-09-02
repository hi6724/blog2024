'use client';
import { IBlogOverview } from '@/react-query/types';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { thumbnailList } from '@/assets/images/thumbnail/index';

function BlogItem({ data, i = 1 }: { data: IBlogOverview; i?: number }) {
  const router = useRouter();
  const createdAt = dayjs(data.createdAt);
  const today = dayjs();
  const src = thumbnailList[i % thumbnailList.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className='card card-compact sm:card-normal w-full shadow-lg dark:shadow-base-content/20 cursor-pointer'
      onClick={() => router.push(`/blog/${data.id}`)}
      whileHover={{
        scale: 1.05,
      }}
    >
      {data.thumbImageUri ? (
        <figure className='h-32 hidden'>
          <Image src={data.thumbImageUri} alt='thumbImageUri' width={400} height={400} className='w-full' />
        </figure>
      ) : (
        <figure className='h-32 hidden'>
          <div
            className='hero h-full w-full bg-cover bg-center'
            style={{
              backgroundImage: `url(${src.src})`,
            }}
          >
            <div className='hero-overlay bg-opacity-60'></div>
            <div className='hero-content text-neutral-content text-center'>
              <div className='max-w-md'>
                <h1 className='text-2xl font-letter font-bold border px-8 py-4'>NO IMG</h1>
              </div>
            </div>
          </div>
        </figure>
      )}
      <div className='card-body !gap-1 !px-4'>
        {/* title */}
        <h2 className='card-title !mb-2'>{data.title}</h2>
        {/* contents */}
        <div>
          <p className='line-clamp-3 text-sm'>{data.overview}</p>
        </div>
        <p className='mt-2 text-xs font-semibold opacity-40 flex-grow-0'>
          <span>{createdAt.format(createdAt.get('year') !== today.get('year') ? 'YYYY년 M월 D일' : 'M월 D일')}</span>
          {data.comments && <span className='ml-2'>{data.comments}개의 댓글</span>}
        </p>
        <div className='divider mb-1 mt-0'></div>
        {/* tags */}
        <div className='flex gap-1'>
          {data.tags.map((tag: string, i: number) => (
            <div className='badge badge-accent badge-outline' key={i}>
              {tag}
            </div>
          ))}
        </div>
        {/* footer */}
      </div>
    </motion.div>
  );
}

export default BlogItem;
