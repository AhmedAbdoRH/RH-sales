"use client";

import type { Customer } from '@/lib/types';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addCustomer, deleteCustomer, updateCustomer } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from './ui/textarea';

const BulletPoints = ({ text }: { text: string | undefined }) => {
  if (!text) return null;
  const points = text.split('\n').filter(p => p.trim() !== '');
  return (
    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
      {points.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  );
};


export function CustomerList() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'customers');
  }, [firestore, user]);

  const { data: customers, isLoading } = useCollection<Customer>(customersQuery);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;

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
    
    if (dialogMode === 'edit' && selectedCustomer) {
      updateCustomer(firestore, selectedCustomer.id, { name, phone, generalInfo, needs, customerConcerns });
      toast({ title: "تم تحديث العميل", description: `تم تحديث بيانات ${name}.` });
    } else {
      addCustomer(firestore, { name, phone, generalInfo, needs, customerConcerns });
      toast({ title: "تمت إضافة العميل", description: `تمت إضافة ${name} إلى قاعدة بياناتك.` });
    }
    
    setDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddClick = () => {
    setDialogMode('add');
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, customer: Customer) => {
    e.stopPropagation();
    setDialogMode('edit');
    setSelectedCustomer(customer);
    setDialogOpen(true);
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
        variant: "destructive",
      });
      setCustomerToDelete(null);
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString();
    }
    return 'التاريخ غير متوفر';
  }

  const showLoading = isLoading || isUserLoading;

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={handleAddClick}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة عميل
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showLoading && (
          <>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </>
        )}
        {!showLoading && customers?.map((customer) => (
          <Card key={customer.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-start justify-between">
              <div onClick={(e) => handleEditClick(e, customer)} className="cursor-pointer space-y-1">
                <CardTitle className="text-xl">{customer.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  تاريخ الانضمام: {formatDate(customer.addedDate)}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">فتح القائمة</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={(e) => handleEditClick(e, customer)}>تعديل</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onSelect={(e) => handleDeleteClick(e, customer.id)}>حذف</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-grow space-y-4 cursor-pointer" onClick={(e) => handleEditClick(e, customer)}>
              {customer.generalInfo && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">معلومات</h4>
                  <BulletPoints text={customer.generalInfo} />
                </div>
              )}
              {customer.needs && (
                 <div>
                  <h4 className="text-sm font-semibold mb-1">الاحتياجات</h4>
                  <BulletPoints text={customer.needs} />
                </div>
              )}
              {customer.customerConcerns && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">المخاوف</h4>
                  <BulletPoints text={customer.customerConcerns} />
                </div>
              )}
            </CardContent>
            {customer.phone && (
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={`tel:${customer.phone}`}>
                            <Phone className="ml-2 h-4 w-4" />
                            اتصال
                        </a>
                    </Button>
                </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleFormSubmit}>
            <DialogHeader>
              <DialogTitle>{dialogMode === 'edit' ? 'تعديل العميل' : 'إضافة عميل جديد'}</DialogTitle>
              <DialogDescription>
                {dialogMode === 'edit' ? 'قم بتحديث تفاصيل العميل أدناه.' : 'املأ تفاصيل العميل أدناه.'}
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
            </div>
            <DialogFooter>
              <Button type="submit">{dialogMode === 'edit' ? 'حفظ التغييرات' : 'حفظ العميل'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!customerToDelete} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف العميل وكافة بياناته المرتبطة به بشكل دائم.
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
