"use server";

import { summarizeCustomerConcerns } from '@/ai/flows/summarize-customer-concerns';
import { z } from 'zod';

const concernSchema = z.object({
  concern: z.string().min(10, { message: "Concern must be at least 10 characters." }),
});

export type FormState = {
  message: string;
  summary?: string;
  category?: string;
  success: boolean;
};

export async function getConcernSummary(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = concernSchema.safeParse({
    concern: formData.get('concern'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.concern?.join(', ') || "Invalid input.",
      success: false,
    };
  }
  
  try {
    const result = await summarizeCustomerConcerns({ concern: validatedFields.data.concern });
    if (result.summary && result.categorySuggestion) {
        return {
            message: "Analysis successful.",
            summary: result.summary,
            category: result.categorySuggestion,
            success: true,
        };
    } else {
        return { message: "AI could not process the concern.", success: false };
    }
  } catch (error) {
    console.error(error);
    return { message: "An error occurred during AI analysis. Please try again.", success: false };
  }
}
