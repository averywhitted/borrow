import { useState, useEffect } from 'react';

export interface WishlistBook {
  id: string;
  title: string;
  author: string;
  nearbyCount?: number;
}

// ─── In-memory store ──────────────────────────────────────────────────────────

const wishlist: WishlistBook[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getWishlist(): WishlistBook[] {
  return wishlist;
}

export function isWishlisted(bookId: string): boolean {
  return wishlist.some((b) => b.id === bookId);
}

export function addToWishlist(book: WishlistBook): void {
  if (!isWishlisted(book.id)) {
    wishlist.push(book);
    notify();
  }
}

export function removeFromWishlist(bookId: string): void {
  const idx = wishlist.findIndex((b) => b.id === bookId);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
    notify();
  }
}

export function toggleWishlist(book: WishlistBook): void {
  if (isWishlisted(book.id)) {
    removeFromWishlist(book.id);
  } else {
    addToWishlist(book);
  }
}

// ─── React hooks ──────────────────────────────────────────────────────────────

export function useWishlist(): WishlistBook[] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const update = () => setTick((t) => t + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);
  return wishlist;
}

/** Returns a stable boolean that re-renders when this book's wishlist state changes. */
export function useIsWishlisted(bookId: string): boolean {
  const [, setTick] = useState(0);
  useEffect(() => {
    const update = () => setTick((t) => t + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);
  return isWishlisted(bookId);
}
