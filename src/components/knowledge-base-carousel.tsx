'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from './ui/skeleton';
import { collection, limit, query } from 'firebase/firestore';
import type { KnowledgeBaseArticle } from '@/lib/types';
import { KnowledgeBaseCard } from './knowledge-base-card';


export function KnowledgeBaseCarousel() {
  const firestore = useFirestore();

  const articlesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'knowledge_base_articles'), limit(5));
  }, [firestore]);

  const { data: articles, isLoading } = useCollection<Omit<KnowledgeBaseArticle, 'id'>>(articlesQuery);

  if (isLoading) {
    return (
      <div className="flex space-x-4 rtl:space-x-reverse">
        <Skeleton className="h-48 w-1/3" />
        <Skeleton className="h-48 w-1/3" />
        <Skeleton className="h-48 w-1/3" />
      </div>
    );
  }
  
  return (
    <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
      <CarouselContent>
        {articles?.map((article) => (
          <CarouselItem key={article.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="p-1 h-full">
              <KnowledgeBaseCard article={article as KnowledgeBaseArticle} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
