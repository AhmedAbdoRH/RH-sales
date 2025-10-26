import type { Concern, Customer } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConcernChart } from '@/components/concern-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

type ConcernStats = {
  category: string;
  count: number;
};

export function ConcernDashboard({ concerns, customers }: { concerns: Concern[], customers: Customer[] }) {
  const concernCounts = concerns.reduce((acc, concern) => {
    acc[concern.category] = (acc[concern.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const concernStats: ConcernStats[] = Object.entries(concernCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
    
  const recentConcerns = [...concerns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  
  const customerMap = new Map(customers.map(c => [c.id, c]));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>أبرز اهتمامات العملاء</CardTitle>
          <CardDescription>
            تحليل للاعتراضات والأسئلة الأكثر شيوعًا.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConcernChart data={concernStats.slice(0, 5)} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>إجمالي الاهتمامات</CardTitle>
          <CardDescription>جميع الاهتمامات المسجلة حتى الآن.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-full flex-col justify-center">
          <div className="text-5xl font-bold">{concerns.length}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            لدى {customers.length} عملاء
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>الاهتمامات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الملخص</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentConcerns.map((concern) => {
                const customer = customerMap.get(concern.customerId);
                return (
                  <TableRow key={concern.id}>
                    <TableCell>
                      <Link href={`/customers/${customer?.id}`} className="flex items-center gap-2 font-medium hover:underline">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer?.avatarUrl} alt={customer?.name} />
                          <AvatarFallback>{customer?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{customer?.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{concern.category}</Badge>
                    </TableCell>
                    <TableCell>{concern.summary}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{new Date(concern.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
