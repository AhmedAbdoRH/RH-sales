export type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  avatarUrl: string;
  addedDate: string;
};

export type Concern = {
  id: string;
  customerId: string;
  date: string;
  originalText: string;
  summary: string;
  category: string;
  status: "new" | "analyzed" | "resolved";
};

export type KnowledgeBaseArticle = {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
};
