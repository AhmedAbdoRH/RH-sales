"use client";

import type { Customer } from '@/lib/types';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Card, CardContent } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { addCustomer } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export function CustomerList() {
  const router = useRouter();
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const firestore = useFirestore();

  const customersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'customers');
  }, [firestore]);

  const { data: customers, isLoading } = useCollection<Omit<Customer, 'id'>>(customersQuery);

  const handleAddCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const phone = formData.get('phone') as string;

    if (!firestore || !name || !email) {
        toast({
            title: "خطأ",
            description: "الاسم والبريد الإلكتروني مطلوبان.",
            variant: "destructive"
        });
        return;
    }
    
    const newCustomer = { name, email, company, phone };
    addCustomer(firestore, newCustomer);
    
    setOpenAddDialog(false);
    
    toast({
      title: "تمت إضافة العميل",
      description: `تمت إضافة ${newCustomer.name} إلى قاعدة بياناتك.`,
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


  return (
    <>
      <div className="flex justify-end">
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة عميل
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddCustomer}>
              <DialogHeader>
                <DialogTitle>إضافة عميل جديد</DialogTitle>
                <DialogDescription>
                  املأ تفاصيل ملف العميل الجديد. انقر على "حفظ" عند الانتهاء.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    الاسم
                  </Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    البريد الإلكتروني
                  </Label>
                  <Input id="email" name="email" type="email" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    الشركة
                  </Label>
                  <Input id="company" name="company" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    الهاتف
                  </Label>
                  <Input id="phone" name="phone" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">حفظ العميل</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>الشركة</TableHead>
                <TableHead className="hidden md:table-cell">تاريخ الانضمام</TableHead>
                <TableHead>
                  <span className="sr-only">إجراءات</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  <TableRow>
                    <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                </>
              )}
              {!isLoading && customers?.map((customer) => (
                <TableRow key={customer.id} className="cursor-pointer" onClick={() => router.push(`/customers/${customer.id}`)}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                  </TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(customer.addedDate)}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
