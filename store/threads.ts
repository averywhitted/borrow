import { useState, useEffect } from 'react';

export type RequestStatus = 'pending' | 'accepted' | 'declined';

export interface BorrowRequest {
  id: string;
  fromName: string;
  bookTitle: string;
  bookAuthor?: string;
  fromDate: string;
  untilDate: string;
  note?: string;
  status: RequestStatus;
}

export interface Message {
  id: string;
  fromMe: boolean;
  text: string | null;
  isRequestCard?: boolean;
  isStatus?: boolean;
  requestData?: BorrowRequest;
}

export interface Thread {
  id: string;
  neighborId: string;
  neighborName: string;
  messages: Message[];
  lastUpdated: number;
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const threadStore: Thread[] = [
  {
    id: '1',
    neighborId: 'jaydon',
    neighborName: 'Jaydon Workman',
    lastUpdated: Date.now(),
    messages: [
      {
        id: 'm1', fromMe: false, text: null, isRequestCard: true,
        requestData: {
          id: 'req1', fromName: 'Mira Siphron',
          bookTitle: 'Piranesi', bookAuthor: 'Susanna Clarke',
          fromDate: 'Mar 10', untilDate: 'Mar 24', status: 'accepted',
        },
      },
      { id: 'm2', fromMe: false, text: 'Jaydon Workman accepted your borrow request', isStatus: true },
      { id: 'm3', fromMe: false, text: 'Hey! Just saw the borrow request—of course you can take Piranesi! 😊' },
      { id: 'm4', fromMe: true, text: 'Ahh thanks!' },
      { id: 'm5', fromMe: false, text: 'So official lol' },
      { id: 'm6', fromMe: true, text: 'Honestly same when I got yours for Song of Achilles haha.' },
      { id: 'm7', fromMe: false, text: "Speaking of… I'm like 3 chapters in and already emotionally unstable." },
    ],
  },
];

// ─── Simple pub/sub for React re-renders ─────────────────────────────────────

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function getAllThreads(): Thread[] {
  return threadStore;
}

export function getThread(threadId: string): Thread | undefined {
  return threadStore.find((t) => t.id === threadId);
}

export function getThreadByNeighborId(neighborId: string): Thread | undefined {
  return threadStore.find((t) => t.neighborId === neighborId);
}

/** Returns an existing thread with this neighbor, or creates one. */
export function getOrCreateThread(neighborId: string, neighborName: string): Thread {
  let thread = getThreadByNeighborId(neighborId);
  if (!thread) {
    thread = {
      id: `thread_${Date.now()}`,
      neighborId,
      neighborName,
      messages: [],
      lastUpdated: Date.now(),
    };
    threadStore.push(thread);
  }
  return thread;
}

/** Appends a borrow-request card to the thread. */
export function addBorrowRequest(thread: Thread, request: BorrowRequest): void {
  thread.messages.push({
    id: `msg_${Date.now()}`,
    fromMe: true,
    text: null,
    isRequestCard: true,
    requestData: request,
  });
  thread.lastUpdated = Date.now();
  notify();
}

/** Updates the status of a specific request and optionally appends a status message. */
export function updateRequestStatus(
  threadId: string,
  requestId: string,
  status: RequestStatus,
): void {
  const thread = threadStore.find((t) => t.id === threadId);
  if (!thread) return;

  const msg = thread.messages.find((m) => m.requestData?.id === requestId);
  if (msg?.requestData) {
    msg.requestData.status = status;
    const verb = status === 'accepted' ? 'accepted' : 'declined';
    thread.messages.push({
      id: `msg_${Date.now()}`,
      fromMe: false,
      text: `${thread.neighborName} ${verb} your borrow request`,
      isStatus: true,
    });
    thread.lastUpdated = Date.now();
    notify();
  }
}

/** Appends a chat message to a thread. */
export function sendMessage(threadId: string, text: string): void {
  const thread = threadStore.find((t) => t.id === threadId);
  if (!thread) return;
  thread.messages.push({ id: `msg_${Date.now()}`, fromMe: true, text });
  thread.lastUpdated = Date.now();
  notify();
}

// ─── React hooks ─────────────────────────────────────────────────────────────

export function useThreads(): Thread[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const update = () => setTick((t) => t + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);
  return threadStore;
}

export function useThread(threadId: string): Thread | undefined {
  const [, setTick] = useState(0);
  useEffect(() => {
    const update = () => setTick((t) => t + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);
  return getThread(threadId);
}
