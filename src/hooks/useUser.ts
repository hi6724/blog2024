import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface IUser {
  username: string;
  icon: string;
  userId: string;
}

function useUser() {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const prevData = JSON.parse(localStorage.getItem('hunmok-blog') ?? 'null');
    if (!prevData) {
      setUser(null);
      return;
    }

    const { username, icon, userId } = prevData;
    if (!username || !icon || !userId) {
      localStorage.removeItem('hunmok-blog');
      setUser(null);
      return;
    }

    setUser(prevData);
  }, []);

  function createOrUpdateUser(data: Omit<IUser, 'userId'> & Partial<Pick<IUser, 'userId'>>) {
    const userId = user?.userId ?? uuid();
    if (user === null) {
      const newUser = { ...data, userId };
      localStorage.setItem('hunmok-blog', JSON.stringify(newUser));
      setUser(newUser);
    } else {
      const newUser = { ...data, userId };
      localStorage.setItem('hunmok-blog', JSON.stringify(newUser));
      setUser(newUser);
    }
    return userId;
  }

  return { user, createOrUpdateUser };
}

export default useUser;
