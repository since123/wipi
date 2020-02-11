interface IUser {
  name: string;
  avatar: string;
  mail: string;
  token: string;
}

interface IFile {
  id: string;
  originalname: string;
  filename: string;
  type: string;
  size: number;
  url: string;
  createAt: string;
}

interface IArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  cover?: string;
  html: string;
  toc: string;
  views: number;
  tags?: [any];
  status: string;
  password?: string; // 访问密码
  needPassword: boolean;
  isCommentable?: boolean; // 是否可评论
  createAt: string;
  updateAt: string;
  publishAt: string;
}

interface ITag {
  id: string;
  label: string;
  value: string;
  icon: string;
  articles?: IArticle[];
}

interface IPage {
  id: string;
  name: string;
  path: string;
  cover?: string;
  content: string;
  html: string;
  toc: string;
  status: string;
  createAt: string;
  publishAt: string;
}

interface IComment {
  id: string;
  articleId: string;
  parentCommentId: string;
  name: string;
  email: string;
  content: string;
  html: string;
  pass: boolean;
  createAt: string;
  article?: IArticle;
  isInPage: boolean;
}

interface IView {
  id: string;
  userAgent: string;
  url: string;
  count: number;
  createAt: string;
  updateAt: string;
}

interface IMail {
  id: string;
  from: string;
  to: string;
  subject: number;
  text: string;
  html: string;
  createAt: string;
}

interface ISearch {
  id: string;
  type: string;
  keyword: string;
  count: number;
  createAt: string;
}
