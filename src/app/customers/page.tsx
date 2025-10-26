import { CustomerList } from '@/components/customer-list';

export default async function CustomersPage() {
  
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div className='space-y-1'>
            <h1 className="text-3xl font-bold tracking-tight">العملاء</h1>
            <p className="text-muted-foreground">إدارة قاعدة بيانات العملاء وعرض ملفاتهم الشخصية.</p>
        </div>
      </div>
      <CustomerList />
    </div>
  );
}
