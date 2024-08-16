import { useQuery } from '@tanstack/react-query';

export interface IAboutMeOverview {
  id: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export const getAboutMe = async () => await (await fetch(`/api/about-me`)).json();

export const useAboutMeOverview = () =>
  useQuery<IAboutMeOverview[]>({
    queryKey: ['about-me'],
    queryFn: getAboutMe,
  });
