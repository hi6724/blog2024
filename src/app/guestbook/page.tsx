'use client';

import ChatItem from '@/components/guestbook/ChatItem';
import { useGuestBookList } from '@/react-query/guestbook';
import { IGuestBook } from '@/react-query/types';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import SubmitForm from '@/components/guestbook/SubmitForm';
import { FormProvider, useForm } from 'react-hook-form';

function GuestBookPage() {
  const { data, fetchNextPage, hasNextPage } = useGuestBookList({ page_size: 12, sort: 'descending' });
  const guestBookItems = data?.pages.reduce((prev: IGuestBook[], crr) => [...prev, ...crr.results], []);
  const [submittedItems, setSubmittedItems] = useState<IGuestBook[]>([]);
  const [editItems, setEditItems] = useState<IGuestBook[]>([]);
  const editItemsIds = editItems.map((el) => el.id);

  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <div>
        <h1 className='text-title p-2 z-20 sticky top-14 bg-base-100 '>GUESTBOOK</h1>

        {guestBookItems && (
          <InfiniteScroll
            dataLength={guestBookItems.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<h4>Loading...</h4>}
            className={`grid gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 relative bg-base-100 px-4 py-8`}
            endMessage={
              <p className='sm:col-span-3 text-center p-8'>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {[...submittedItems, ...guestBookItems]?.map((chat, i) => {
              if (editItemsIds.includes(chat.id))
                return <ChatItem data={editItems.find((el) => chat.id === el.id) as IGuestBook} key={chat.id} />;
              return <ChatItem data={chat} key={chat.id} />;
            })}
          </InfiniteScroll>
        )}
        <SubmitForm setItems={setSubmittedItems} setEditItems={setEditItems} />
      </div>
    </FormProvider>
  );
}

export default GuestBookPage;
