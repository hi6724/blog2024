import { formatDateWithDay } from '@/lib/date';
import React from 'react';

function MyDateProperty({ data }: { data: any }) {
  const date = data?.[0]?.[1]?.[0]?.[1];
  const startDate = date?.start_date;
  const endDate = date?.end_date;
  if (!date) return null;
  if (!endDate) return <span>{formatDateWithDay(startDate, { time: true })}</span>;
  return (
    <span>
      {formatDateWithDay(startDate)} ~ {formatDateWithDay(endDate)}
    </span>
  );
}

export default MyDateProperty;
