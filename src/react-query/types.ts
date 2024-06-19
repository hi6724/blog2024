export interface IListQueryParams {
  cursor?: string;
  page_size?: number;
  sort?: 'ascending' | 'descending';
  filter?: string;
}

export interface IGuestBook {
  content: string;
  createdAt: string;
  icon: string;
  id: string;
  title: string;
  user: {
    password: string;
    username: string;
  };
}

export interface IProjectOverView {
  id: string;
  icon: string;
  thumbImageUri: string;
  startData: string;
  endDate: string;
  type: string;
  title: string;
  skills: string[];
  overview: string;
  overview2: string;
  overviewImg: string;
}
