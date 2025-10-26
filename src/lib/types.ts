export type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  avatarUrl?: string; // Made avatar optional
  addedDate: any; // Can be a string or a Firestore Timestamp
};

export type Concern = {
  id: string;
  customerId: string;
  date: any; // Can be a string or a Firestore Timestamp
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

export type Skill = {
  id: string;
  title: string;
  description: string;
};
