'use client';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const DUMMY = [
  { tags: ['FE', 'BE', 'DEV', '구름톤'], title: 'DUMMY TITLE', content: '', id: 'askjld9' },
  { tags: ['FE', '구름톤'], title: 'DUMMY TITLE', content: '', id: 'ask312jld9' },
  { tags: ['SQL'], title: 'DUMMY TITLE', content: '', id: 'askzvxjld9' },
  { tags: ['FE', 'SSAFY'], title: 'DUMMY TITLE', content: '', id: 'askja2fgld9' },
  { tags: ['일상', 'SSAFY'], title: 'DUMMY TITLE', content: '', id: 'askjazxvas2fgld9' },
];

function Blog() {
  const [blogItems, setBlogItems] = useState(DUMMY);
  const ref = useRef<HTMLDivElement>(null);
  const isShowTitle = useInView(ref);
  return (
    <>
      <div className='h-[25vh]' />
      <motion.h1
        className='text-title z-10 sticky top-16 bg-base-100 text-base-content bg-opacity-30 backdrop-blur-lg mb-6 p-2'
        initial={{ opacity: 0 }}
        animate={{ opacity: isShowTitle ? 1 : 0 }}
      >
        BLOG
      </motion.h1>
      <div ref={ref} className='grid gap-4 p-2 sm:grid-cols-2 md:grid-cols-3 '>
        {blogItems.map((data, index) => (
          <BlogItem key={data.id} data={data} />
        ))}
      </div>
      <button className='btn btn-outline w-full mt-4'>READ MORE</button>
    </>
  );
}

export default Blog;

function BlogItem({ data }: any) {
  const router = useRouter();
  return (
    <motion.div
      className='card card-compact sm:card-normal w-full bg-base-100 shadow-xl'
      onClick={() => router.push(`/blog/${data.id}`)}
    >
      <figure className='h-32 hidden'>
        <img src='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg' alt='Shoes' />
      </figure>
      <div className='card-body'>
        {/* title */}
        <h2 className='card-title'>Card title!</h2>
        {/* contents */}
        <p className='line-clamp-2'>
          If a dog chews shoes whose shoes does he choose?If a dog chews shoes whose shoes does he choose?If a dog chews
          shoes whose shoes does he choose? If a dog chews shoes whose shoes does he choose? If a dog chews shoes whose
          shoes does he choose? If a dog chews shoes whose shoes does he choose? If a dog chews shoes whose shoes does
          he choose?If a dog chews shoes whose shoes does he choose?If a dog chews shoes whose shoes does he choose? If
          a dog chews shoes whose shoes does he choose?If a dog chews shoes whose shoes does he choose?If a dog chews
          shoes whose shoes does he choose?If a dog chews shoes whose shoes does he choose?If a dog chews shoes whose
          shoes does he choose?
        </p>
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
        <p className='text-sm font-semibold opacity-40'>2024년 6월 7일 | 2개의 댓글</p>
      </div>
    </motion.div>
  );
}
