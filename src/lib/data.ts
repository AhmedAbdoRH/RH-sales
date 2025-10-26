'use client';

import type { Customer, KnowledgeBaseArticle, Skill } from './types';
import {
  collection,
  Timestamp,
} from 'firebase/firestore';
import { type Firestore } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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

export const addKnowledgeBaseArticle = (firestore: Firestore, article: Omit<KnowledgeBaseArticle, 'id'>) => {
  const articleCollection = collection(firestore, 'knowledge_base_articles');
  addDocumentNonBlocking(articleCollection, article);
};

export const addSkill = (firestore: Firestore, skill: Omit<Skill, 'id'>) => {
  const skillCollection = collection(firestore, 'skills');
  addDocumentNonBlocking(skillCollection, skill);
};
