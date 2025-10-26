"use client";

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormState } from 'react-dom';
import { getConcernSummary } from '@/lib/actions';
import { useFirestore } from '@/firebase';
import { addConcern } from '@/lib/data';

const initialState: { message: string, summary?: string, category?: string, success: boolean } = {
  message: '',
  success: false,
};

export function AddConcernForm({ customerId, title }: { customerId: string, title: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, formAction] = useFormState(getConcernSummary, initialState);
  const [concernText, setConcernText] = useState('');
  const firestore = useFirestore();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!concernText) {
        toast({
            title: "لا يمكن الحفظ",
            description: "يرجى كتابة شيء ما أولاً.",
            variant: "destructive",
        });
        return;
    }

    if (!firestore) {
        toast({
            title: "خطأ في الاتصال",
            description: "لا يمكن الاتصال بقاعدة البيانات.",
            variant: "destructive",
        });
        return;
    }

    const formData = new FormData(event.currentTarget);
    const result = await getConcernSummary(initialState, formData);

    if (result.success && result.summary && result.category) {
        addConcern(firestore, customerId, concernText, result.summary, result.category);
        toast({
          title: `تم حفظ ${title}`,
          description: `تمت إضافة ${title} الجديد إلى ملف تعريف العميل.`,
        });
        formRef.current?.reset();
        setConcernText('');
        router.refresh(); 
    } else {
        toast({
            title: "فشل الحفظ",
            description: result.message,
            variant: "destructive",
        });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <Label htmlFor="concern">سجل {title} جديد</Label>
        <Textarea
          id="concern"
          name="concern"
          placeholder=""
          rows={2}
          required
          value={concernText}
          onChange={(e) => setConcernText(e.target.value)}
        />
      </div>
       <Button type="submit" className="w-full justify-center">
            <Save className="mr-2 h-4 w-4" />
            إضافة
       </Button>
    </form>
  );
}
