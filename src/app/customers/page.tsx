import { CustomerList } from '@/components/customer-list';
import { Suspense } from 'react';

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">قائمة العملاء</h1>
      </div>
      <Suspense fallback={<div className="text-center">جاري تحميل العملاء...</div>}>
        <CustomerList />
      </Suspense>
    </div>
  );
}
