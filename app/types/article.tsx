// types/article.ts
export interface Article {
  id: string;
  title: string;
  content: string;
  userId: string;
  imageUrl: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  user: {
    id: string;
    username: string;
    role: string;
  };
}
export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
}
