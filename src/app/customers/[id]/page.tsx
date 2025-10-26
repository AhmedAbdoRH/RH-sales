import { getCustomerById, getConcernsByCustomerId } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Mail, Phone, CalendarDays } from 'lucide-react';
import { AddConcernForm } from '@/components/add-concern-form';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default async function CustomerProfilePage({ params }: { params: { id: string } }) {
  const customer = await getCustomerById(params.id);
  const concerns = await getConcernsByCustomerId(params.id);

  if (!customer) {
    notFound();
  }
  
  const sortedConcerns = [...concerns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-3 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>إضافة اهتمام جديد</CardTitle>
              <CardDescription>سجل اهتمام عميل جديد وقم بتحليله باستخدام الذكاء الاصطناعي.</CardDescription>
            </CardHeader>
            <CardContent>
              <AddConcernForm customerId={customer.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سجل الاهتمامات</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedConcerns.length > 0 ? (
                <ul className="space-y-4">
                  {sortedConcerns.map(concern => (
                    <li key={concern.id} className="rounded-lg border bg-card p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-2">{concern.category}</Badge>
                          <p className="font-semibold">{concern.summary}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{concern.originalText}</p>
                        </div>
                        <span className="whitespace-nowrap text-xs text-muted-foreground">{new Date(concern.date).toLocaleDateString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <p>لم يتم تسجيل أي اهتمامات لهذا العميل بعد.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
