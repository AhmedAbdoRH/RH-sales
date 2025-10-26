import { KnowledgeBaseClient } from '@/components/knowledge-base-client';
import { getKnowledgeBaseArticles } from '@/lib/data';

export default async function KnowledgeBasePage() {
  const articles = await getKnowledgeBaseArticles();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">قاعدة المعرفة</h1>
        <p className="text-muted-foreground">ابحث عن إجابات ونماذج لسيناريوهات المبيعات الشائعة.</p>
      </div>
      <KnowledgeBaseClient articles={articles} />
    </div>
  );
}
