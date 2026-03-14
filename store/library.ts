import { useState, useEffect } from 'react';
import { sendMessage } from './threads';

export type BookStatus = 'in-library' | 'lending' | 'borrowing' | 'overdue';

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  dueDate?: string;
  threadId?: string;
}

// ─── In-memory store ──────────────────────────────────────────────────────────

const books: LibraryBook[] = [
  { id: '1', title: 'Piranesi',                  author: 'Susanna Clarke',   status: 'lending',   dueDate: 'Mar 24', threadId: '1' },
  { id: '2', title: 'The Remains of the Day',    author: 'Kazuo Ishiguro',   status: 'overdue',   dueDate: 'Mar 1',  threadId: '2' },
  { id: '3', title: 'Dune',                      author: 'Frank Herbert',    status: 'in-library'                    },
  { id: '4', title: 'Kindred',                   author: 'Octavia Butler',   status: 'in-library'                    },
  { id: '5', title: 'Convenience Store Woman',   author: 'Sayaka Murata',    status: 'in-library'                    },
  { id: '6', title: "Giovanni's Room",           author: 'James Baldwin',    status: 'in-library'                    },
  { id: '7', title: 'Normal People',             author: 'Sally Rooney',     status: 'borrowing', dueDate: 'Apr 2',  threadId: '1' },
  { id: '8', title: 'The Midnight Library',      author: 'Matt Haig',        status: 'borrowing', dueDate: 'Mar 30', threadId: '3' },
];

const listeners = new Set<() => void>();
function notify() { listeners.forEach(fn => fn()); }

// ─── Queries ──────────────────────────────────────────────────────────────────

export function getBooks(): LibraryBook[] { return [...books]; }
export function getBook(id: string): LibraryBook | undefined { return books.find(b => b.id === id); }

// ─── Mutations ────────────────────────────────────────────────────────────────

export function returnBook(bookId: string): void {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  const title = book.title;
  book.status = 'in-library';
  book.dueDate = undefined;
  if (book.threadId) sendMessage(book.threadId, `📦 Returned "${title}" — thanks for lending!`);
  notify();
}

export function markReceived(bookId: string): void {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  const title = book.title;
  book.status = 'in-library';
  book.dueDate = undefined;
  if (book.threadId) sendMessage(book.threadId, `✅ Received "${title}" back — all good!`);
  notify();
}

// ─── React hooks ──────────────────────────────────────────────────────────────

export function useBooks(): LibraryBook[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const update = () => setTick(t => t + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);
  return books;
}

export function useBook(id: string | undefined): LibraryBook | undefined {
  const [, setTick] = useState(0);
  useEffect(() => {
    const update = () => setTick(t => t + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);
  return id ? books.find(b => b.id === id) : undefined;
}
