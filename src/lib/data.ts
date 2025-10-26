'use client';

import type { Customer, Concern, KnowledgeBaseArticle } from './types';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { type Firestore } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// This file will now primarily contain functions to interact with Firestore.
// The mock data is no longer needed.

// NOTE: We are keeping the old functions that return mock data
// so that other parts of the app that haven't been migrated yet
// don't break.

const customers: Customer[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@example.com', company: 'Innovate Inc.', phone: '555-0101', addedDate: '2023-10-26' },
  { id: '2', name: 'Michael Chen', email: 'm.chen@example.com', company: 'Solutions Co.', phone: '555-0102', addedDate: '2023-11-15' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@example.com', company: 'Dynamic Corp.', phone: '555-0103', addedDate: '2024-01-20' },
  { id: '4', name: 'David Lee', email: 'david.lee@example.com', company: 'FutureTek', phone: '555-0104', addedDate: '2024-02-10' },
  { id: '5', name: 'Jessica Williams', email: 'j.williams@example.com', company: 'Enterprise LLC', phone: '555-0105', addedDate: '2024-03-01' },
  { id: '6', name: 'Chris Brown', email: 'chris.b@example.com', company: 'Synergy Group', phone: '555-0106', addedDate: '2024-04-05' },
];

const concerns: Concern[] = [
  { id: 'c1', customerId: '1', date: '2024-04-01', originalText: "The price seems a bit high compared to your competitors.", summary: 'Price high vs. competitors', category: 'Pricing', status: 'analyzed' },
  { id: 'c2', customerId: '2', date: '2024-04-03', originalText: "I'm not sure if the integration process will be smooth with our existing systems.", summary: 'Integration concerns with current systems', category: 'Integration', status: 'analyzed' },
  { id: 'c3', customerId: '1', date: '2024-04-05', originalText: "What kind of support do you offer after the purchase?", summary: 'Post-purchase support inquiry', category: 'Support', status: 'resolved' },
  { id: 'c4', customerId: '3', date: '2024-04-08', originalText: "Your competitor is offering a free trial period, but you are not.", summary: 'Competitor offers free trial', category: 'Pricing', status: 'new' },
  { id: 'c5', customerId: '4', date: '2024-04-10', originalText: "The user interface looks complicated. How long does it take to train a new employee?", summary: 'UI complexity and training time', category: 'Usability', status: 'analyzed' },
  { id: 'c6', customerId: '5', date: '2024-04-12', originalText: "Do you have any case studies from companies in our industry?", summary: 'Requests industry-specific case studies', category: 'Social Proof', status: 'analyzed' },
  { id: 'c7', customerId: '2', date: '2024-04-15', originalText: "The contract terms seem too rigid. Is there any room for negotiation?", summary: 'Questions contract flexibility', category: 'Legal', status: 'new' },
  { id: 'c8', customerId: '6', date: '2024-04-18', originalText: "We need a solution that can scale with our company's growth over the next 5 years.", summary: 'Scalability for future growth', category: 'Features', status: 'analyzed' },
];

const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
    { id: 'kb1', title: "Handling Price Objections", category: "Objection Handling", content: "When a customer says the price is too high, first acknowledge their concern. Then, pivot to the value and ROI. Use the 'price vs. cost' framework to explain the long-term benefits.", tags: ["pricing", "negotiation", "value"] },
    { id: 'kb2', title: "Competitor Comparison: Innovate Inc.", category: "Competitive Intelligence", content: "Innovate Inc. focuses on a low-cost entry model but lacks our advanced automation features and dedicated support. Highlight our superior TCO (Total Cost of Ownership).", tags: ["competitor", "innovate inc", "features"] },
    { id: 'kb3', title: "Explaining the Integration Process", category: "Technical Sales", content: "Our integration process is a 3-step guided workflow. It starts with a discovery call, followed by sandbox testing, and finally, a phased production rollout. The average time to go-live is 2 weeks.", tags: ["integration", "onboarding", "technical"] },
    { id: 'kb4', title: "Standard Support Package Details", category: "Support & SLA", content: "Our standard support package includes 24/7 email support, with a 4-hour response time for critical issues. Phone support is available during business hours (9am-5pm customer's time).", tags: ["support", "sla", "service"] },
    { id: 'kb5', title: "Upselling to the Enterprise Plan", category: "Sales Techniques", content: "Identify customers who are hitting usage limits or requesting features only available in the Enterprise plan. Frame the upgrade as a solution to their growing needs and a way to unlock more value.", tags: ["upselling", "enterprise", "growth"] },
];

// New Firestore-based functions

export const addCustomer = (firestore: Firestore, customer: Omit<Customer, 'id' | 'addedDate'>) => {
  const customerCollection = collection(firestore, 'customers');
  const newCustomer = {
    ...customer,
    addedDate: Timestamp.now(),
  }
  addDocumentNonBlocking(customerCollection, newCustomer);
};

export const addConcern = (firestore: Firestore, customerId: string, concernText: string, summary: string, category: string) => {
    const concernsCollection = collection(firestore, 'customers', customerId, 'concerns');
    const newConcern = {
        date: Timestamp.now(),
        originalText: concernText,
        summary: summary,
        category: category,
        status: 'analyzed',
        customerId: customerId,
    };
    addDocumentNonBlocking(concernsCollection, newConcern);
};


// Old mock data functions (to be deprecated)
export const getCustomers = async (): Promise<Customer[]> => {
  return new Promise(resolve => setTimeout(() => resolve(customers), 50));
};

export const getCustomerById = async (id: string): Promise<Customer | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(customers.find(c => c.id === id)), 50));
};

export const getConcerns = async (): Promise<Concern[]> => {
    return new Promise(resolve => setTimeout(() => resolve(concerns), 50));
};

export const getConcernsByCustomerId = async (customerId: string): Promise<Concern[]> => {
    return new Promise(resolve => setTimeout(() => resolve(concerns.filter(c => c.customerId === customerId)), 50));
};

export const getKnowledgeBaseArticles = async (): Promise<KnowledgeBaseArticle[]> => {
    return new Promise(resolve => setTimeout(() => resolve(knowledgeBaseArticles), 50));
};
