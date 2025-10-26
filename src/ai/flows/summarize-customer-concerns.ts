'use server';

/**
 * @fileOverview Summarizes customer concerns and provides category suggestions using AI.
 *
 * - summarizeCustomerConcerns - A function that handles the summarization and category suggestion process.
 * - SummarizeCustomerConcernsInput - The input type for the summarizeCustomerConcerns function.
 * - SummarizeCustomerConcernsOutput - The return type for the summarizeCustomerConcerns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCustomerConcernsInputSchema = z.object({
  concern: z
    .string()
    .describe('The customer concern to summarize and categorize.'),
});
export type SummarizeCustomerConcernsInput = z.infer<
  typeof SummarizeCustomerConcernsInputSchema
>;

const SummarizeCustomerConcernsOutputSchema = z.object({
  summary: z.string().describe('A short summary of the customer concern.'),
  categorySuggestion: z
    .string()
    .describe('A suggested category for the customer concern.'),
});
export type SummarizeCustomerConcernsOutput = z.infer<
  typeof SummarizeCustomerConcernsOutputSchema
>;

export async function summarizeCustomerConcerns(
  input: SummarizeCustomerConcernsInput
): Promise<SummarizeCustomerConcernsOutput> {
  return summarizeCustomerConcernsFlow(input);
}

const summarizeConcernTool = ai.defineTool({
  name: 'summarizeConcern',
  description: 'Summarizes a customer concern into a concise statement.',
  inputSchema: z.object({
    concern: z.string().describe('The customer concern to summarize.'),
  }),
  outputSchema: z.string(),
  async (input) => {
    const {text} = await ai.generate({
      prompt: `Summarize the following customer concern: ${input.concern}`,
    });
    return text;
  },
});

const prompt = ai.definePrompt({
  name: 'summarizeCustomerConcernsPrompt',
  input: {schema: SummarizeCustomerConcernsInputSchema},
  output: {schema: SummarizeCustomerConcernsOutputSchema},
  tools: [summarizeConcernTool],
  prompt: `You are a sales expert. A customer has the following concern: {{{concern}}}.

  First, use the summarizeConcern tool to create a summary.

  Then, suggest a category to file the concern under in the knowledge base.  Make it one or two words.

  Return the summary and suggested category in the format specified by the output schema.`,
});

const summarizeCustomerConcernsFlow = ai.defineFlow(
  {
    name: 'summarizeCustomerConcernsFlow',
    inputSchema: SummarizeCustomerConcernsInputSchema,
    outputSchema: SummarizeCustomerConcernsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
