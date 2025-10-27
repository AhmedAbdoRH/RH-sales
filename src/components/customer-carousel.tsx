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
import { Phone, Trash2, Pencil, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteCustomer, updateCustomer, moveCustomer, updateConvictionScore } from '@/lib/data';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { WhatsappIcon } from './whatsapp-icon';

const cardColors = [
  'bg-card-blue',
  'bg-card-purple',
  'bg-card-green',
  'bg-card-orange',
  'bg-card-pink'
];

const BulletPoints = ({ text }: { text: string | undefined }) => {
  if (!text) return null;
  const points = text.split('\n');
  return (
    <ul className="list-disc list-inside text-card-foreground space-y-1">
      {points.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  );
};


export function CustomerCarousel() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Fetch all customers without ordering at the query level
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
      deleteCustomer(firestore, customerToDelete, customers);
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
    const company = formData.get('company') as string;
    const generalInfo = formData.get('generalInfo') as string;
    const needs = formData.get('needs') as string;
    const customerConcerns = formData.get('customerConcerns') as string;
    const phone = formData.get('phone') as string;
    const bestTimeToContact = formData.get('bestTimeToContact') as string;

    if (!name) {
        toast({ title: "خطأ", description: "الاسم مطلوب.", variant: "destructive" });
        return;
    }
    
    updateCustomer(firestore, selectedCustomer.id, { name, company, phone, generalInfo, needs, customerConcerns, bestTimeToContact });
    toast({ title: "تم تحديث العميل", description: `تم تحديث بيانات ${name}.` });
    
    setEditDialogOpen(false);
    setSelectedCustomer(null);
  };
  
  const handleMove = (customerId: string, direction: 'left' | 'right') => {
    if (firestore && sortedCustomers) {
       moveCustomer(firestore, sortedCustomers, customerId, direction);
    }
  };

  const handleScoreChange = (e: React.MouseEvent, customerId: string, currentScore: number, delta: 1 | -1) => {
    e.stopPropagation();
    if (firestore) {
      updateConvictionScore(firestore, customerId, currentScore, delta);
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
  
  // Sort customers locally. Customers without a displayOrder get a high value to be pushed to the end.
  const sortedCustomers = customers 
    ? [...customers].sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity))
    : [];

  return (
    <>
      <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
        <CarouselContent>
          {sortedCustomers?.map((customer, idx) => {
            const score = customer.convictionScore ?? 1;
            const cleanPhoneNumber = customer.phone?.replace(/\D/g, '');
            return (
              <CarouselItem key={customer.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                    <Card className={cn("hover:border-primary transition-colors h-full flex flex-col", cardColors[idx % cardColors.length])}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-medium">{customer.name}</CardTitle>
                            <div className="flex items-center gap-1">
                               <Button
                                variant="ghost"
                                size="icon"
                                className="size-5"
                                disabled={score <= 1}
                                onClick={(e) => handleScoreChange(e, customer.id, score, -1)}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <span className="font-bold text-yellow-400">+{score}</span>
                               <Button
                                variant="ghost"
                                size="icon"
                                className="size-5"
                                disabled={score >= 5}
                                onClick={(e) => handleScoreChange(e, customer.id, score, 1)}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {customer.company && <p className="text-xs text-muted-foreground">{customer.company}</p>}
                        </div>
                        <div className="flex items-center bg-card/50 backdrop-blur-sm rounded-full">
                            <Button variant="ghost" size="icon" onClick={() => handleMove(customer.id, 'right')} disabled={idx === 0}>
                              <ArrowRight className="h-4 w-4" />
                              <span className="sr-only">تحريك لليمين</span>
                            </Button>
                             <Button variant="ghost" size="icon" onClick={() => handleMove(customer.id, 'left')} disabled={idx === sortedCustomers.length - 1}>
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
                      <CardContent className="flex-grow space-y-3 p-6 pt-2">
                        {customer.generalInfo && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1 text-info-title">معلومات</h4>
                            <BulletPoints text={customer.generalInfo} />
                          </div>
                        )}
                        {customer.needs && (
                           <div>
                            <h4 className="text-sm font-semibold mb-1 text-needs-title">الاحتياجات</h4>
                            <BulletPoints text={customer.needs} />
                          </div>
                        )}
                        {customer.customerConcerns && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1 text-concerns-title">المخاوف</h4>
                            <BulletPoints text={customer.customerConcerns} />
                          </div>
                        )}
                      </CardContent>
                       {customer.phone && (
                          <CardFooter className="pt-0 flex-col items-stretch">
                               <div className="flex w-full gap-2">
                                  <Button variant="outline" size="sm" className="flex-1" asChild>
                                      <a href={`https://wa.me/${cleanPhoneNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                          <WhatsappIcon className="h-4 w-4" />
                                          واتساب
                                      </a>
                                  </Button>
                                  <Button variant="outline" size="sm" className="flex-1" asChild>
                                      <a href={`tel:${customer.phone}`} className="flex items-center justify-center gap-2">
                                          <Phone className="h-4 w-4" />
                                          اتصال
                                      </a>
                                  </Button>
                              </div>
                              {customer.bestTimeToContact && (
                                  <p className="text-center text-xs text-muted-foreground mt-2">
                                      {customer.bestTimeToContact}
                                  </p>
                              )}
                          </CardFooter>
                      )}
                    </Card>
                </div>
              </CarouselItem>
          )})}
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
                  <Label htmlFor="company" className="text-right">المجال</Label>
                  <Input id="company" name="company" defaultValue={selectedCustomer?.company} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="generalInfo" className="text-right pt-2">معلومات</Label>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">رقم الهاتف</Label>
                <Input id="phone" name="phone" defaultValue={selectedCustomer?.phone} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bestTimeToContact" className="text-right">وقت التواصل</Label>
                <Input id="bestTimeToContact" name="bestTimeToContact" defaultValue={selectedCustomer?.bestTimeToContact} className="col-span-3" placeholder="مثال: بعد 5 مساءً"/>
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
