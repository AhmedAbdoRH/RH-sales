import { Suspense } from 'react';
import { SkillsList } from '@/components/skills-list';

export default function SkillsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">كل المهارات</h1>
      </div>
      <Suspense fallback={<div className="text-center">جاري تحميل المهارات...</div>}>
        <SkillsList />
      </Suspense>
    </div>
  );
}
