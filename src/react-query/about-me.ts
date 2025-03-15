import { useQuery } from "@tanstack/react-query";

export interface IAboutMeOverview {
  id: string;
  title: string;
  date: {
    start: string;
    end: string;
  };
  tags: { id: string; name: string; color: string }[];
  content: string;
  img?: string;
}

export const getAboutMe = async () => await (await fetch(`/api/about-me/overview`)).json();

export const useAboutMeOverview = () =>
  useQuery<IAboutMeOverview[]>({
    queryKey: ["about-me"],
    queryFn: getAboutMe,
  });

export const getAboutMeList = async () => await (await fetch(`/api/about-me`)).json();

export const useAboutMeList = () =>
  useQuery<IAboutMeOverview[]>({
    queryKey: ["about-me/list"],
    queryFn: getAboutMeList,
  });

export interface IWorkHistory {
  total: number;
  kb: number;
}
const getWorkHistory = async () => await (await fetch(`/api/time`)).json();
export const useWorkHistory = () => useQuery<IWorkHistory>({ queryKey: ["time"], queryFn: getWorkHistory });
