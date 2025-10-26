'use client';

import type { Customer } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, limit, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function CustomerCarousel() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const customersQuery = useMemoFirebase(() => {
    // Wait until the user is loaded and authenticated before creating the query.
    if (!firestore || !user) return null;
    return query(collection(firestore, 'customers'), limit(5));
  }, [firestore, user]);

  const { data: customers, isLoading } = useCollection<Omit<Customer, 'id'>>(customersQuery);
  
  const handleEditClick = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();
    toast({
      title: "ميزة التعديل",
      description: `سيتم فتح نموذج لتعديل العميل ${customerId}.`,
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();
    toast({
      title: "ميزة الحذف",
      description: `سيتم حذف العميل ${customerId}.`,
      variant: "destructive",
    });
  };


  if (isLoading || isUserLoading) {
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
            <div className="p-1 h-full">
                <Card className="hover:border-primary transition-colors h-full flex flex-col">
                  <CardHeader className="flex flex-row items-start justify-between">
                     <div onClick={() => router.push(`/customers/${customer.id}`)} className="cursor-pointer space-y-1">
                        <CardTitle className="text-base">{customer.name}</CardTitle>
                     </div>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">فتح القائمة</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => router.push(`/customers/${customer.id}`)}>عرض</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => handleEditClick(e, customer.id)}>تعديل</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => handleDeleteClick(e, customer.id)}>حذف</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-6 pt-0 text-center flex-grow cursor-pointer" onClick={() => router.push(`/customers/${customer.id}`)}>
                    <p className="text-sm text-muted-foreground">{customer.company}</p>
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
