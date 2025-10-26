'use client';

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
import { SalesSkillsCarousel } from '@/components/sales-skills-carousel';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
        {/* Section 1: Top Information (Knowledge Base) */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-right">أهم المعلومات</h2>
                 <Link href="/knowledge-base" className="text-sm font-medium text-primary hover:underline">
                    عرض الكل
                </Link>
            </div>
            <KnowledgeBaseCarousel />
        </section>

        {/* Section 2: Top Required Skills */}
        <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-right">أهم المهارات المطلوبة</h2>
            <SalesSkillsCarousel />
        </section>

        {/* Section 3: Top Customers */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-right">أهم العملاء</h2>
                <Link href="/customers" className="text-sm font-medium text-primary hover:underline">
                    عرض الكل
                </Link>
            </div>
            <CustomerCarousel />
        </section>
    </div>
  );
}
