import { ConcernDashboard } from '@/components/concern-dashboard';
import { getConcerns, getCustomers } from '@/lib/data';

export default async function DashboardPage() {
  // Fetch data on the server
  const concerns = await getConcerns();
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your sales assistant. Here's a summary of customer activity.
        </p>
      </div>
      <ConcernDashboard concerns={concerns} customers={customers} />
    </div>
  );
}
