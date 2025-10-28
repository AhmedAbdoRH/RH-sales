'use client';

import { CustomerCarousel } from '@/components/customer-carousel';
import { KnowledgeBaseCarousel } from '@/components/knowledge-base-carousel';
import { ScrollingSkills } from '@/components/scrolling-skills';


export default function DashboardPage() {
  return (
    <div className="space-y-8">
        {/* Section 1: Top Customers */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-right">أهم العملاء</h2>
            </div>
            <CustomerCarousel />
        </section>

        {/* Section 2: Top Required Skills */}
        <section>
            <ScrollingSkills />
        </section>

        {/* Section 3: Top Responses (Knowledge Base) */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-right">اهم الردود</h2>
            </div>
            <KnowledgeBaseCarousel />
        </section>
    </div>
  );
}
