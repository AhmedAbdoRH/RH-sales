import { getCustomers, getKnowledgeBaseArticles } from '@/lib/data';
import { salesSkills } from '@/lib/skills';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { KnowledgeBaseCard } from '@/components/knowledge-base-card';

export default async function DashboardPage() {
  const customers = await getCustomers();
  const articles = await getKnowledgeBaseArticles();

  return (
    <div className="space-y-8">
        {/* Section 1: Top Required Skills */}
        <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-right">أهم المهارات المطلوبة</h2>
            <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
            <CarouselContent>
                {salesSkills.map((skill, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-base">{skill.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground">{skill.description}</p>
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

        {/* Section 2: Top Customers */}
        <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-right">أهم العملاء</h2>
            <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
            <CarouselContent>
                {customers.slice(0, 5).map((customer) => (
                <CarouselItem key={customer.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                    <Link href={`/customers/${customer.id}`}>
                        <Card className="hover:border-primary transition-colors h-full">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
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
        
        {/* Section 3: Top Information (Knowledge Base) */}
        <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-right">أهم المعلومات</h2>
            <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
            <CarouselContent>
                {articles.slice(0, 5).map((article) => (
                <CarouselItem key={article.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                    <KnowledgeBaseCard article={article} />
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            </Carousel>
        </section>
    </div>
  );
}
