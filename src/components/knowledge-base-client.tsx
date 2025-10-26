"use client";

import { useState } from 'react';
import type { KnowledgeBaseArticle } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export function KnowledgeBaseClient({ articles }: { articles: KnowledgeBaseArticle[] }) {
  const [searchTerm, setSearchTerm] = useState('');

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
                  <div className="flex gap-2 pt-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
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
