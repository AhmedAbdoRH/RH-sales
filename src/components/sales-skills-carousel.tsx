'use client';

import type { Skill } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';

export function SalesSkillsCarousel() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const skillsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'skills'));
  }, [firestore, user]);

  const { data: skills, isLoading } = useCollection<Omit<Skill, 'id'>>(skillsQuery);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex space-x-4 rtl:space-x-reverse">
        <Skeleton className="h-32 w-1/3" />
        <Skeleton className="h-32 w-1/3" />
        <Skeleton className="h-32 w-1/3" />
      </div>
    );
  }

  return (
    <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
      <CarouselContent>
        {skills?.map((skill) => (
          <CarouselItem key={skill.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="p-1 h-full">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{skill.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
