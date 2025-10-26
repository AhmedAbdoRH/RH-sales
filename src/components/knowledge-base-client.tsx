"use client";

import { useState } from 'react';
import type { KnowledgeBaseArticle } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export function KnowledgeBaseClient({ articles }: { articles: KnowledgeBaseArticle[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (e: React.MouseEvent, content: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    setCopiedItemId(id);
    toast({ title: "تم النسخ!", description: "تم نسخ محتوى المقال إلى الحافظة." });
    setTimeout(() => setCopiedItemId(null), 2000);
  };
  
  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toast({ title: "ميزة التعديل", description: `سيتم فتح نموذج لتعديل المقال ${id}.` });
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="ابحث في المقالات، الوسوم، أو الكلمات المفتاحية..."
          className="w-full max-w-lg pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        {filteredArticles.length > 0 ? (
           <Accordion type="single" collapsible className="w-full">
            {filteredArticles.map(article => (
              <AccordionItem value={article.id} key={article.id}>
                <AccordionTrigger>
                    <div className='text-right'>
                        <p className='font-semibold'>{article.title}</p>
                        <Badge variant="outline" className="mt-1">{article.category}</Badge>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-base">{article.content}</p>
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={(e) => handleEdit(e, article.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">تعديل المحتوى</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => handleCopy(e, article.content, article.id)}>
                            {copiedItemId === article.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            <span className="sr-only">نسخ المحتوى</span>
                        </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            <p>لم يتم العثور على مقالات لـ "{searchTerm}".</p>
            <p className="text-sm">حاول البحث بكلمة مفتاحية مختلفة.</p>
          </div>
        )}
      </div>
    </div>
  );
}
