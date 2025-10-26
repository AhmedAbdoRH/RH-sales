import { getCustomers, getKnowledgeBaseArticles } from '@/lib/data';
import { salesSkills } from '@/lib/skills';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function DashboardPage() {
  const customers = await getCustomers();
  const articles = await getKnowledgeBaseArticles();

  return (
    <div className="space-y-8">
      {/* Section 1: Top Customers */}
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
      
      {/* Section 2: Top Information (Knowledge Base) */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-right">أهم المعلومات</h2>
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

      {/* Section 3: Top Required Skills */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-right">أهم المهارات المطلوبة</h2>
        <Carousel opts={{ align: 'start', direction: 'rtl' }} className="w-full">
          <CarouselContent>
            {salesSkills.map((skill, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{skill.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
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
    </div>
  );
}
