'use client';

import type { Customer } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { MoreHorizontal, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { deleteCustomer } from '@/lib/data';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';


export function CustomerCarousel() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'customers'), limit(5));
  }, [firestore, user]);

  const { data: customers, isLoading } = useCollection<Customer>(customersQuery);
  
  const handleEditClick = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();
    router.push(`/customers`);
    toast({
      title: "التعديل من صفحة العملاء",
      description: `يمكنك تعديل العميل ${customerId} من قائمة العملاء الكاملة.`,
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();
    setCustomerToDelete(customerId);
  };
  
  const handleConfirmDelete = () => {
    if (firestore && customerToDelete) {
      deleteCustomer(firestore, customerToDelete);
      toast({
        title: "تم حذف العميل",
        description: "تم حذف العميل بنجاح من قاعدة البيانات.",
      });
      setCustomerToDelete(null);
    }
  };


  if (isLoading || isUserLoading) {
    return (
      <div className="flex space-x-4 rtl:space-x-reverse">
        <Skeleton className="h-48 w-1/3" />
        <Skeleton className="h-48 w-1/3" />
        <Skeleton className="h-48 w-1/3" />
      </div>
    );
  }
  
  return (
    <>
      <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
        <CarouselContent>
          {customers?.map((customer) => (
            <CarouselItem key={customer.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
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
                    <CardContent className="flex-grow space-y-3 cursor-pointer p-6 pt-0" onClick={() => router.push(`/customers/${customer.id}`)}>
                      {customer.generalInfo && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1">معلومات عامة</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">{customer.generalInfo}</p>
                        </div>
                      )}
                      {customer.needs && (
                         <div>
                          <h4 className="text-sm font-semibold mb-1">الاحتياجات</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">{customer.needs}</p>
                        </div>
                      )}
                      {customer.customerConcerns && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1">المخاوف</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-2">{customer.customerConcerns}</p>
                        </div>
                      )}
                    </CardContent>
                     {customer.phone && (
                        <CardFooter className="pt-0">
                            <Button variant="outline" size="sm" className="w-full" asChild>
                                <a href={`tel:${customer.phone}`}>
                                    <Phone className="ml-2 h-4 w-4" />
                                    اتصال
                                </a>
                            </Button>
                        </CardFooter>
                    )}
                  </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <AlertDialog open={!!customerToDelete} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف العميل بشكل دائم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
