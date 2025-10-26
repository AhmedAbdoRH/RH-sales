'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddConcernForm } from '@/components/add-concern-form';
import type { Customer } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  
  const customerRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'customers', params.id);
  }, [firestore, params.id]);

  const { data: customer, isLoading } = useDoc<Omit<Customer, 'id'>>(customerRef);

  if (isLoading) {
    return (
        <>
            <div className="mb-6">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-6 w-1/4 mt-2" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </>
    );
  }

  if (!customer) {
    notFound();
  }

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground">{customer.company}</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>الاهتمامات</CardTitle>
            <CardDescription>سجل اهتمام جديد للعميل.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddConcernForm customerId={params.id} title="الاهتمام" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>المخاوف</CardTitle>
            <CardDescription>سجل مخاوف جديدة للعميل.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddConcernForm customerId={params.id} title="المخاوف" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
