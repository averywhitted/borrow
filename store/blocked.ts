import { useState, useEffect } from 'react';

export interface BlockedUser {
  id: string;
  name: string;
  blockedAt: number;
}

let _blocked: BlockedUser[] = [];
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach(fn => fn());
}

export function blockUser(user: BlockedUser) {
  if (!_blocked.find(u => u.id === user.id)) {
    _blocked = [..._blocked, { ...user, blockedAt: Date.now() }];
    notify();
  }
}

export function unblockUser(id: string) {
  _blocked = _blocked.filter(u => u.id !== id);
  notify();
}

export function isBlocked(id: string): boolean {
  return _blocked.some(u => u.id === id);
}

export function useBlocked(): BlockedUser[] {
  const [list, setList] = useState<BlockedUser[]>(_blocked);
  useEffect(() => {
    const unsub = () => setList([..._blocked]);
    _listeners.add(unsub);
    return () => { _listeners.delete(unsub); };
  }, []);
  return list;
}
