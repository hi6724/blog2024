'use client';
import { useMobile } from '@/hooks/useMobile';
import { formatDateWithDay } from '@/lib/date';
import { useProjectDetail } from '@/react-query/project';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { NotionRenderer } from 'react-notion-x';
import { Collection } from 'react-notion-x/build/third-party/collection';
import MyCodeBlock from '../notion/MyCodeBlock';
import MyDateProperty from '../notion/MyDateProperty';

const NAME_MAP: { [key: string]: string } = {
  date: '진행기간',
  type: '프로젝트 유형',
  link: '링크',
  skills: '기술 스택',
  overview: '프로젝트 개요',
};
const DELETE_KEYS = ['overviewImg', 'createdAt', 'overview2', '상태'];

function ProjectDetailMain({ data }: { data: any }) {
  const isMobile = useMobile();
  const { theme } = useTheme();
  const collectionKey = Object.keys(data?.collection ?? {})?.[0];
  const schema = data?.collection[collectionKey].value.schema;

  // 링크가 없는 페이지는 링크 항목을 삭제
  Object.keys(data?.block ?? {}).forEach((key) => {
    const type = data.block[key].value.type;
    if (type !== 'page') return;
    if (!data.block[key].value.properties.BUjZ?.[0]?.[0]) DELETE_KEYS.push('link');
  });

  // 페이지 프로퍼티 이름 변경
  Object.keys(schema ?? {}).forEach((key) => {
    const name = schema[key].name;
    if (DELETE_KEYS.includes(name)) {
      delete schema[key];
    } else if (name in NAME_MAP) {
      schema[key].name = NAME_MAP[name];
    }
  });
  return (
    <NotionRenderer
      recordMap={data}
      showTableOfContents={!isMobile}
      components={{
        Image: Image,
        Collection,
        propertyDateValue: MyDateProperty,
        Code: MyCodeBlock,
      }}
      fullPage
      className={`${theme?.includes('dark') ? 'dark-mode' : 'light-mode'} !font-sans w-full`}
    />
  );
}

export default ProjectDetailMain;
