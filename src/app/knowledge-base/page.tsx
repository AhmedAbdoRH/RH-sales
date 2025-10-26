'use client';

import { KnowledgeBaseClient } from '@/components/knowledge-base-client';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { KnowledgeBaseArticle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function KnowledgeBasePage() {
  const firestore = useFirestore();
  
  const articlesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'knowledge_base_articles');
  }, [firestore]);

  const { data: articles, isLoading } = useCollection<Omit<KnowledgeBaseArticle, 'id'>>(articlesQuery);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">قاعدة المعرفة</h1>
        <p className="text-muted-foreground">ابحث عن إجابات ونماذج لسيناريوهات المبيعات الشائعة.</p>
      </div>
       {isLoading && (
          <div className="space-y-4">
              <Skeleton className="h-12 w-full max-w-lg" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
          </div>
      )}
      {!isLoading && articles && (
        <KnowledgeBaseClient articles={articles as KnowledgeBaseArticle[]} />
      )}
    </div>
  );
}
