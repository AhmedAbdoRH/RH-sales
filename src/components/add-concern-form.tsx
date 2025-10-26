"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AddConcernForm({ customerId, title }: { customerId: string, title: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSaveConcern = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const concernText = formData.get('concern') as string;

    if (!concernText) {
        toast({
            title: "لا يمكن الحفظ",
            description: "يرجى كتابة شيء ما أولاً.",
            variant: "destructive",
        });
        return;
    }

    // In a real app, this would save the concern to the database.
    console.log(`Saving ${title}:`, {
      customerId,
      originalText: concernText,
    });

    toast({
      title: `تم حفظ ${title}`,
      description: `تمت إضافة ${title} الجديد إلى ملف تعريف العميل.`,
    });

    formRef.current?.reset();
    // Refresh the page to show the new concern in the history list (if any).
    router.refresh(); 
  };

  return (
    <form ref={formRef} onSubmit={handleSaveConcern} className="space-y-4">
      <div>
        <Label htmlFor="concern">سجل {title} جديد</Label>
        <Textarea
          id="concern"
          name="concern"
          placeholder=""
          rows={3}
          required
        />
      </div>
       <Button type="submit" className="w-full justify-center">
            <Save className="mr-2 h-4 w-4" />
            إضافة
       </Button>
    </form>
  );
}
