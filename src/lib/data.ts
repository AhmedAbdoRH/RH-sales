'use client';

import type { Customer, KnowledgeBaseArticle, Skill } from './types';
import {
  collection,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  type Firestore,
  query,
  orderBy,
  limit,
  getDocs,
  writeBatch,
  getCountFromServer
} from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type UpdatableCustomerData = Partial<Omit<Customer, 'id' | 'addedDate' | 'email'>>;


export const addCustomer = async (firestore: Firestore, customer: Partial<Omit<Customer, 'id' | 'addedDate'>>) => {
  const customerCollection = collection(firestore, 'customers');
  const placeholderEmail = `${customer.name?.toLowerCase().replace(/\s/g, '.')}@placeholder.email`;
  
  // Get the current number of customers to determine the next displayOrder
  const snapshot = await getDocs(customerCollection);
  const currentCount = snapshot.size;

  const newCustomer = {
    name: customer.name || "Unnamed Customer",
    email: customer.email || placeholderEmail,
    company: customer.company || '',
    phone: customer.phone || '',
    generalInfo: customer.generalInfo || '',
    needs: customer.needs || '',
    customerConcerns: customer.customerConcerns || '',
    addedDate: Timestamp.now(),
    displayOrder: currentCount,
  }
  addDocumentNonBlocking(customerCollection, newCustomer);
};

export const updateCustomer = (firestore: Firestore, customerId: string, data: UpdatableCustomerData) => {
  const customerDoc = doc(firestore, 'customers', customerId);
  updateDocumentNonBlocking(customerDoc, data);
};

export const deleteCustomer = async (firestore: Firestore, customerId: string, customers?: Customer[]) => {
    const customerDoc = doc(firestore, 'customers', customerId);
    await deleteDoc(customerDoc);

    if (customers) {
        // After deletion, re-order the remaining customers
        const remainingCustomers = customers.filter(c => c.id !== customerId).sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity));
        
        const batch = writeBatch(firestore);
        remainingCustomers.forEach((customer, index) => {
            const docRef = doc(firestore, 'customers', customer.id);
            batch.update(docRef, { displayOrder: index });
        });

        await batch.commit();
    }
};

export const moveCustomer = async (firestore: Firestore, customers: Customer[], customerId: string, direction: 'left' | 'right') => {
  const sortedCustomers = customers.sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity));
  const currentIndex = sortedCustomers.findIndex(c => c.id === customerId);

  if (currentIndex === -1) return;

  const newIndex = direction === 'left' ? currentIndex + 1 : currentIndex - 1; // Adjusted for RTL
  
  if (newIndex < 0 || newIndex >= sortedCustomers.length) {
    return; // Already at the end or beginning
  }

  const customerToMove = sortedCustomers[currentIndex];
  const otherCustomer = sortedCustomers[newIndex];

  if (!customerToMove || !otherCustomer) return;

  const orderToMove = customerToMove.displayOrder ?? currentIndex;
  const orderToSwap = otherCustomer.displayOrder ?? newIndex;

  const batch = writeBatch(firestore);

  const movedCustomerRef = doc(firestore, 'customers', customerToMove.id);
  batch.update(movedCustomerRef, { displayOrder: orderToSwap });

  const otherCustomerRef = doc(firestore, 'customers', otherCustomer.id);
  batch.update(otherCustomerRef, { displayOrder: orderToMove });

  try {
    await batch.commit();
  } catch (error) {
    console.error("Error moving customer:", error);
  }
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

export const addKnowledgeBaseArticle = (firestore: Firestore, article: Partial<Omit<KnowledgeBaseArticle, 'id'>>) => {
  const articleCollection = collection(firestore, 'knowledge_base_articles');
  const newArticle = {
    title: article.title || 'بدون عنوان',
    content: article.content || '',
    category: article.category || 'عام',
    tags: article.tags || []
  };
  addDocumentNonBlocking(articleCollection, newArticle);
};

export const updateKnowledgeBaseArticle = (firestore: Firestore, articleId: string, data: Partial<Omit<KnowledgeBaseArticle, 'id'>>) => {
    const articleDoc = doc(firestore, 'knowledge_base_articles', articleId);
    updateDocumentNonBlocking(articleDoc, data);
};

export const deleteKnowledgeBaseArticle = (firestore: Firestore, articleId: string) => {
    const articleDoc = doc(firestore, 'knowledge_base_articles', articleId);
    deleteDocumentNonBlocking(articleDoc);
};


export const addSkill = (firestore: Firestore, skill: Omit<Skill, 'id'>) => {
  const skillCollection = collection(firestore, 'skills');
  addDocumentNonBlocking(skillCollection, skill);
};

export const updateSkill = (firestore: Firestore, skillId: string, data: Partial<Omit<Skill, 'id'>>) => {
    const skillDoc = doc(firestore, 'skills', skillId);
    updateDocumentNonBlocking(skillDoc, data);
};

export const deleteSkill = (firestore: Firestore, skillId: string) => {
    const skillDoc = doc(firestore, 'skills', skillId);
    deleteDocumentNonBlocking(skillDoc);
};