'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { KnowledgeBaseArticle } from '@/lib/types';
import { KnowledgeBaseClient } from '@/components/knowledge-base-client';
import { Skeleton } from '@/components/ui/skeleton';

export default function KnowledgeBasePage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const articlesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'knowledge_base_articles');
  }, [firestore, user]);

  const { data: articles, isLoading } = useCollection<KnowledgeBaseArticle>(articlesQuery);

  if (isLoading || isUserLoading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold tracking-tight">قاعدة المعرفة</h1>
            </div>
            <Skeleton className="h-10 w-full max-w-lg" />
            <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        </div>
    );
  }
  
  const sortedArticles = articles 
    ? [...articles].sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    : [];

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">قاعدة المعرفة</h1>
        </div>
        <KnowledgeBaseClient articles={sortedArticles} />
    </div>
  );
}
