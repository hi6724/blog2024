import { useQuery } from '@tanstack/react-query';

export interface IAboutMeOverview {
  id: string;
  title: string;
  date: {
    start: string;
    end: string;
  };
  tags: string[];
  content: string;
}

export const getAboutMe = async () => await (await fetch(`/api/about-me/overview`)).json();

export const useAboutMeOverview = () =>
  useQuery<IAboutMeOverview[]>({
    queryKey: ['about-me'],
    queryFn: getAboutMe,
  });

export const getAboutMeList = async () => await (await fetch(`/api/about-me`)).json();

export const useAboutMeList = () =>
  useQuery<IAboutMeOverview[]>({
    queryKey: ['about-me/list'],
    queryFn: getAboutMeList,
  });
