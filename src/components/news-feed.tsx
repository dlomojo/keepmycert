"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface NewsItem {
  title: string;
  source: string;
  url: string;
  image?: string;
  publishedAt: string;
  description: string;
}

export default function NewsFeed({ field }: { field: string }) {
  const [data, setData] = useState<{ items: NewsItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news?field=${field}`);
        if (!response.ok) {
          setData({ items: [] });
          return;
        }
        const result = await response.json();
        setData(result.error ? { items: [] } : result);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setData({ items: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [field]);

  if (loading) return <div className="animate-pulse text-sm text-muted-foreground">Loading {field} news…</div>;
  if (!data || !data.items.length) return <div className="text-sm text-muted-foreground">No {field} news available</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.items.slice(0, 6).map((n: NewsItem, i: number) => (
        <a key={n.url || i} href={n.url} target="_blank" rel="noopener noreferrer" className="group rounded-lg border p-4 hover:shadow-md">
          {n.image && <Image src={n.image} alt="" width={300} height={128} className="mb-3 h-32 w-full object-cover rounded-lg" />}
          <div className="text-xs text-muted-foreground">{n.source}</div>
          <div className="font-medium group-hover:underline line-clamp-2">{n.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">{n.description}</div>
        </a>
      ))}
    </div>
  );
}