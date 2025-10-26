import { getConcerns, getCustomers, getKnowledgeBaseArticles } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConcernChart } from '@/components/concern-chart';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Concern, Customer, KnowledgeBaseArticle } from '@/lib/types';

type ConcernStats = {
  category: string;
  count: number;
};

export default async function DashboardPage() {
  const concerns = await getConcerns();
  const customers = await getCustomers();
  const articles = await getKnowledgeBaseArticles();

  const recentConcerns = [...concerns]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const customerMap = new Map(customers.map((c) => [c.id, c]));

  const concernCounts = concerns.reduce((acc, concern) => {
    acc[concern.category] = (acc[concern.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const concernStats: ConcernStats[] = Object.entries(concernCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8">
      {/* Section 1: Recent Concerns */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">أحدث الاهتمامات</h2>
        <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
          <CarouselContent className="-ml-1">
            {recentConcerns.map((concern) => {
              const customer = customerMap.get(concern.customerId);
              return (
                <CarouselItem key={concern.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{concern.summary}</CardTitle>
                        <CardDescription>
                          <Link href={`/customers/${customer?.id}`} className="hover:underline flex items-center gap-2 pt-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={customer?.avatarUrl} alt={customer?.name} />
                              <AvatarFallback>{customer?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{customer?.name}</span>
                          </Link>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Badge variant="secondary">{concern.category}</Badge>
                        <p className="text-sm text-muted-foreground line-clamp-2">{concern.originalText}</p>
                        <p className="text-xs text-muted-foreground pt-2">
                          {new Date(concern.date).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
      
      {/* Section 2: Top Customers */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">أبرز العملاء</h2>
        <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
          <CarouselContent>
            {customers.slice(0, 5).map((customer) => (
              <CarouselItem key={customer.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
                 <div className="p-1">
                  <Link href={`/customers/${customer.id}`}>
                    <Card className="hover:border-primary transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <Avatar className="h-16 w-16 mb-4">
                          <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                          <AvatarFallback>{customer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.company}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Section 3: Knowledge Base */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">مقالات قاعدة المعرفة</h2>
        <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
          <CarouselContent>
            {articles.slice(0, 5).map((article) => (
              <CarouselItem key={article.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                    <Card className="h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription>{article.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">{article.content}</p>
                      </CardContent>
                    </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
      
      {/* Section 4: Concerns Overview */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">نظرة عامة على الاهتمامات</h2>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
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
                <CardContent className="flex h-full flex-col justify-center items-center">
                <div className="text-6xl font-bold">{concerns.length}</div>
                <p className="mt-2 text-sm text-muted-foreground">
                    من {customers.length} عملاء
                </p>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
