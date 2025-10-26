'use client';

import type { Customer } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';

export function CustomerCarousel() {
  const firestore = useFirestore();

  const customersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'customers'), limit(5));
  }, [firestore]);

  const { data: customers, isLoading } = useCollection<Omit<Customer, 'id'>>(customersQuery);

  if (isLoading) {
    return (
      <div className="flex space-x-4 rtl:space-x-reverse">
        <Skeleton className="h-24 w-1/4" />
        <Skeleton className="h-24 w-1/4" />
        <Skeleton className="h-24 w-1/4" />
        <Skeleton className="h-24 w-1/4" />
      </div>
    );
  }
  
  return (
    <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
      <CarouselContent>
        {customers?.map((customer) => (
          <CarouselItem key={customer.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
            <div className="p-1">
              <Link href={`/customers/${customer.id}`}>
                <Card className="hover:border-primary transition-colors h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.company}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
