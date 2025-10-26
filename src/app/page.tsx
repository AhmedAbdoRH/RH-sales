'use client';

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
import { CustomerCarousel } from '@/components/customer-carousel';
import { KnowledgeBaseCarousel } from '@/components/knowledge-base-carousel';

export default function DashboardPage() {
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
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-right">أهم العملاء</h2>
                <Link href="/customers" className="text-sm font-medium text-primary hover:underline">
                    عرض الكل
                </Link>
            </div>
            <CustomerCarousel />
        </section>
        
        {/* Section 3: Top Information (Knowledge Base) */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-right">أهم المعلومات</h2>
                 <Link href="/knowledge-base" className="text-sm font-medium text-primary hover:underline">
                    عرض الكل
                </Link>
            </div>
            <KnowledgeBaseCarousel />
        </section>
    </div>
  );
}
