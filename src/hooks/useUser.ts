import { createUser, getUser } from '@/app/action';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface IUser {
  username: string;
  icon: string;
  userId: string;
  password: string;
}

function useUser() {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const prevData = JSON.parse(localStorage.getItem('hunmok-blog') ?? 'null');
    if (!prevData) {
      setUser(null);
      return;
    }

    const { username, icon, userId, password } = prevData;
    if (!username || !icon || !userId || !password) {
      localStorage.removeItem('hunmok-blog');
      setUser(null);
      return;
    }

    setUser(prevData);
  }, []);

  async function createOrUpdateUser(data: Omit<IUser, 'userId'> & Partial<Pick<IUser, 'userId'>>) {
    const userId = user?.userId ?? uuid();
    const dbUser = await getUser({ password: data.password, userName: data.username });
    if (dbUser.code === 'OK') {
      return dbUser;
    } else if (dbUser.code === 'NO_USER_NAME') {
      const res = await createUser({ userName: data.username, password: data.password, avatar: data.icon });
      setUser({ username: data.username, password: data.password, icon: data.icon, userId });
      return { ok: true, code: 'NEW_USER', user: res.data };
    } else if (dbUser.code === 'WRONG_PASSWORD') {
      alert('동일한 이름이 존재합니다.');
      return null;
    } else {
      return null;
    }
  }

  return { user, createOrUpdateUser };
}

export default useUser;
