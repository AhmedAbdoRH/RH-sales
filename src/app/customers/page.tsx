import { getCustomers } from '@/lib/data';
import { CustomerList } from '@/components/customer-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function CustomersPage() {
  const customers = await getCustomers();
  
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div className='space-y-1'>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">Manage your customer database and view their profiles.</p>
        </div>
      </div>
      <CustomerList customers={customers} />
    </div>
  );
}
