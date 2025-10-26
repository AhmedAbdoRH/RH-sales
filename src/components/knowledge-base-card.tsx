"use client";

import type { KnowledgeBaseArticle } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function KnowledgeBaseCard({ article }: { article: KnowledgeBaseArticle }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(article.content);
    setCopied(true);
    toast({ title: "تم النسخ!", description: "تم نسخ محتوى المقال إلى الحافظة." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <h3 className="text-md font-semibold">{article.title}</h3>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-sm text-muted-foreground flex-grow select-all">
          {article.content}
        </p>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">نسخ المحتوى</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
