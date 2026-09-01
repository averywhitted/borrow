import { useEffect, useState } from 'react';

interface BookData {
  thumbnail: string | null;
  description: string | null;
}

const cache: Record<string, BookData> = {};

export function useGoogleBook(title: string, author?: string): BookData | null {
  const key = `${title}__${author ?? ''}`;
  const [data, setData] = useState<BookData | null>(cache[key] ?? null);

  useEffect(() => {
    if (cache[key]) {
      setData(cache[key]);
      return;
    }
    const q = encodeURIComponent(`intitle:${title}${author ? ` inauthor:${author}` : ''}`);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`)
      .then((r) => r.json())
      .then((json) => {
        const info = json.items?.[0]?.volumeInfo;
        const result: BookData = {
          thumbnail:
            info?.imageLinks?.thumbnail
              ?.replace('http:', 'https:')
              .replace('&edge=curl', '')
              .replace('zoom=1', 'zoom=2') ?? null,
          description: info?.description ?? null,
        };
        cache[key] = result;
        setData(result);
      })
      .catch(() => {});
  }, [key]);

  return data;
}
