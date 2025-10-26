import { getCustomerById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddConcernForm } from '@/components/add-concern-form';

export default async function CustomerProfilePage({ params }: { params: { id: string } }) {
  const customer = await getCustomerById(params.id);

  if (!customer) {
    notFound();
  }

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={customer.avatarUrl} alt={customer.name} />
            <AvatarFallback>{customer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.company}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>الاهتمامات</CardTitle>
            <CardDescription>سجل اهتمام جديد للعميل.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddConcernForm customerId={customer.id} title="الاهتمام" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>المخاوف</CardTitle>
            <CardDescription>سجل مخاوف جديدة للعميل.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddConcernForm customerId={customer.id} title="المخاوف" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
