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
  const snapshot = await getCountFromServer(customerCollection);
  const currentCount = snapshot.data().count;

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

export const deleteCustomer = (firestore: Firestore, customerId: string) => {
  const customerDoc = doc(firestore, 'customers', customerId);
  deleteDocumentNonBlocking(customerDoc);
};

export const moveCustomer = async (firestore: Firestore, customers: Customer[], customerId: string, direction: 'left' | 'right') => {
  const currentIndex = customers.findIndex(c => c.id === customerId);
  if (currentIndex === -1) return;

  const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
  
  if (newIndex < 0 || newIndex >= customers.length) {
    return; // Already at the end or beginning
  }

  const customerToMove = customers[currentIndex];
  const otherCustomer = customers[newIndex];

  if (!customerToMove || !otherCustomer) return;

  // Swap displayOrder values
  const newOrderForMoved = otherCustomer.displayOrder;
  const newOrderForOther = customerToMove.displayOrder;

  const batch = writeBatch(firestore);

  const movedCustomerRef = doc(firestore, 'customers', customerToMove.id);
  batch.update(movedCustomerRef, { displayOrder: newOrderForMoved });

  const otherCustomerRef = doc(firestore, 'customers', otherCustomer.id);
  batch.update(otherCustomerRef, { displayOrder: newOrderForOther });

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

export const addKnowledgeBaseArticle = (firestore: Firestore, article: Omit<KnowledgeBaseArticle, 'id'>) => {
  const articleCollection = collection(firestore, 'knowledge_base_articles');
  addDocumentNonBlocking(articleCollection, article);
};

export const addSkill = (firestore: Firestore, skill: Omit<Skill, 'id'>) => {
  const skillCollection = collection(firestore, 'skills');
  addDocumentNonBlocking(skillCollection, skill);
};
