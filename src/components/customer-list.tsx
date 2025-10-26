"use client";

import type { Customer } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addCustomer } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from './ui/textarea';

export function CustomerList() {
  const router = useRouter();
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const customersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'customers');
  }, [firestore, user]);

  const { data: customers, isLoading } = useCollection<Omit<Customer, 'id'>>(customersQuery);

  const handleAddCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const name = formData.get('name') as string;
    const generalInfo = formData.get('generalInfo') as string;
    const needs = formData.get('needs') as string;
    const customerConcerns = formData.get('customerConcerns') as string;

    if (!firestore || !name) {
        toast({
            title: "خطأ",
            description: "الاسم مطلوب.",
            variant: "destructive"
        });
        return;
    }
    
    addCustomer(firestore, { name, generalInfo, needs, customerConcerns });
    
    setOpenAddDialog(false);
    
    toast({
      title: "تمت إضافة العميل",
      description: `تمت إضافة ${name} إلى قاعدة بياناتك.`,
    });
  };

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
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة عميل
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleAddCustomer}>
              <DialogHeader>
                <DialogTitle>إضافة عميل جديد</DialogTitle>
                <DialogDescription>
                  املأ تفاصيل العميل أدناه.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    الاسم
                  </Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="generalInfo" className="text-right pt-2">
                    معلومات عامة
                  </Label>
                  <Textarea id="generalInfo" name="generalInfo" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="needs" className="text-right pt-2">
                    الاحتياجات
                  </Label>
                  <Textarea id="needs" name="needs" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="customerConcerns" className="text-right pt-2">
                    المخاوف
                  </Label>
                  <Textarea id="customerConcerns" name="customerConcerns" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">حفظ العميل</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                <div onClick={() => router.push(`/customers/${customer.id}`)} className="cursor-pointer space-y-1">
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
                        <DropdownMenuItem onSelect={() => router.push(`/customers/${customer.id}`)}>عرض</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => handleEditClick(e, customer.id)}>تعديل</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => handleDeleteClick(e, customer.id)}>حذف</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-grow space-y-4 cursor-pointer" onClick={() => router.push(`/customers/${customer.id}`)}>
                {customer.generalInfo && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">معلومات عامة</h4>
                    <p className="text-sm text-muted-foreground">{customer.generalInfo}</p>
                  </div>
                )}
                {customer.needs && (
                   <div>
                    <h4 className="text-sm font-semibold mb-1">الاحتياجات</h4>
                    <p className="text-sm text-muted-foreground">{customer.needs}</p>
                  </div>
                )}
                {customer.customerConcerns && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">المخاوف</h4>
                    <p className="text-sm text-muted-foreground">{customer.customerConcerns}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
    </>
  );
}
