export interface IListQueryParams {
  cursor?: string;
  page_size?: number;
  sort?: 'ascending' | 'descending';
  filter?: any;
}

export interface IListResponse<T> {
  has_more: boolean;
  next_cursor?: string;
  results: T[];
}
export interface IGuestBook {
  content: string;
  createdAt: string;
  icon: string;
  id: string;
  title: string;
  username: string;
  userId: string;
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
  link?: string;
}

export interface IBlogOverview {
  id: string;
  createdAt: string;
  icon: string;
  tags: {
    id: string;
    name: string;
    color: string;
  }[];
  title: string;
  overview: string;
  thumbImageUri?: string;
  comments?: number;
}

export interface IComment {
  id: string;
  createdAt: string;
  icon: string;
  username: string;
  userId: string;
  content: string;
}
