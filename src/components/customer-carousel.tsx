"use client";

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
import { collection, query } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Trash2, Pencil, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteCustomer, updateCustomer, moveCustomer } from '@/lib/data';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';


export function CustomerCarousel() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Removing orderBy to ensure all customers are fetched, even without displayOrder
    return query(collection(firestore, 'customers'));
  }, [firestore, user]);

  const { data: customers, isLoading } = useCollection<Customer>(customersQuery);
  
  const handleEditClick = (e: React.MouseEvent, customer: Customer) => {
    e.stopPropagation();
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();
    setCustomerToDelete(customerId);
  };
  
  const handleConfirmDelete = () => {
    if (firestore && customerToDelete && customers) {
      // Also pass customers array to handle reordering after deletion if necessary
      deleteCustomer(firestore, customerToDelete);
      toast({
        title: "تم حذف العميل",
        description: "تم حذف العميل بنجاح من قاعدة البيانات.",
      });
      setCustomerToDelete(null);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !selectedCustomer) return;

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const generalInfo = formData.get('generalInfo') as string;
    const needs = formData.get('needs') as string;
    const customerConcerns = formData.get('customerConcerns') as string;

    if (!name) {
        toast({ title: "خطأ", description: "الاسم مطلوب.", variant: "destructive" });
        return;
    }
    
    updateCustomer(firestore, selectedCustomer.id, { name, phone, generalInfo, needs, customerConcerns });
    toast({ title: "تم تحديث العميل", description: `تم تحديث بيانات ${name}.` });
    
    setEditDialogOpen(false);
    setSelectedCustomer(null);
  };
  
  const handleMove = (customerId: string, direction: 'left' | 'right') => {
    if (firestore && customers) {
      if (customers.every(c => c.displayOrder !== undefined)) {
         moveCustomer(firestore, customers, customerId, direction);
      } else {
        toast({
          title: "ميزة الترتيب غير متاحة",
          description: "يرجى التأكد من أن جميع العملاء لديهم ترتيب عرض.",
          variant: "destructive"
        });
      }
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
  
  // Sort customers locally if displayOrder exists
  const sortedCustomers = customers 
    ? [...customers].sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    : [];

  return (
    <>
      <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
        <CarouselContent>
          {sortedCustomers?.map((customer) => (
            <CarouselItem key={customer.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                  <Card className="hover:border-primary transition-colors h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-base font-medium">{customer.name}</CardTitle>
                      <div className="flex items-center">
                          <Button variant="ghost" size="icon" onClick={() => handleMove(customer.id, 'right')}>
                            <ArrowRight className="h-4 w-4" />
                            <span className="sr-only">تحريك لليمين</span>
                          </Button>
                           <Button variant="ghost" size="icon" onClick={() => handleMove(customer.id, 'left')}>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">تحريك لليسار</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => handleEditClick(e, customer)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">تعديل</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => handleDeleteClick(e, customer.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">حذف</span>
                          </Button>
                       </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3 p-6 pt-0">
                      {customer.generalInfo && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1">معلومات عامة</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{customer.generalInfo}</p>
                        </div>
                      )}
                      {customer.needs && (
                         <div>
                          <h4 className="text-sm font-semibold mb-1">الاحتياجات</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{customer.needs}</p>
                        </div>
                      )}
                      {customer.customerConcerns && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1">المخاوف</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{customer.customerConcerns}</p>
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle>تعديل العميل</DialogTitle>
              <DialogDescription>
                قم بتحديث تفاصيل العميل أدناه.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">الاسم</Label>
                <Input id="name" name="name" defaultValue={selectedCustomer?.name} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">رقم الهاتف</Label>
                <Input id="phone" name="phone" defaultValue={selectedCustomer?.phone} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="generalInfo" className="text-right pt-2">معلومات عامة</Label>
                <Textarea id="generalInfo" name="generalInfo" defaultValue={selectedCustomer?.generalInfo} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="needs" className="text-right pt-2">الاحتياجات</Label>
                <Textarea id="needs" name="needs" defaultValue={selectedCustomer?.needs} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="customerConcerns" className="text-right pt-2">المخاوف</Label>
                <Textarea id="customerConcerns" name="customerConcerns" defaultValue={selectedCustomer?.customerConcerns} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">حفظ التغييرات</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
