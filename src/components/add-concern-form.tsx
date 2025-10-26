"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getConcernSummary, type FormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState: FormState = {
  message: '',
  success: false,
};

function AnalyzeButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Analyze with AI
    </Button>
  );
}

export function AddConcernForm({ customerId }: { customerId: string }) {
  const [state, formAction] = useFormState(getConcernSummary, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        title: "Analysis Failed",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  const handleSaveConcern = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    
    if (!state.summary || !state.category) {
        toast({
            title: "Cannot Save",
            description: "Please analyze a concern with AI first.",
            variant: "destructive",
        });
        return;
    }

    // In a real app, this would save the concern to the database.
    console.log("Saving concern:", {
      customerId,
      originalText: formRef.current?.concern.value,
      summary: state.summary,
      category: state.category,
    });

    toast({
      title: "Concern Saved",
      description: "The new concern has been added to the customer's profile.",
    });

    formRef.current?.reset();
    // Refresh the page to show the new concern in the history list.
    router.refresh(); 
  };

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="concern">Customer's Original Concern</Label>
        <Textarea
          id="concern"
          name="concern"
          placeholder="e.g., 'The price is too high compared to competitor X...'"
          rows={3}
          required
        />
      </div>
      <AnalyzeButton />

      {state.success && (
        <div className="space-y-4 rounded-lg border bg-muted/50 p-4 animate-in fade-in-50">
          <h4 className="font-semibold">AI Analysis Results</h4>
          <div>
            <Label htmlFor="summary">Suggested Summary</Label>
            <Input id="summary" name="summary" defaultValue={state.summary} />
          </div>
          <div>
            <Label htmlFor="category">Suggested Category</Label>
            <Input id="category" name="category" defaultValue={state.category} />
          </div>
          <Button onClick={handleSaveConcern}>
            <Save className="mr-2 h-4 w-4" />
            Save Concern to Profile
          </Button>
        </div>
      )}
    </form>
  );
}
