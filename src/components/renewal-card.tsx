"use client";
import { useState, useEffect } from 'react';

interface RenewalData {
  vendor: string;
  verifiedAt: string;
  canonicalUrl: string;
  steps: string[];
}

export default function RenewalCard({ vendor }: { vendor: string }) {
  const [data, setData] = useState<RenewalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenewal = async () => {
      try {
        const response = await fetch(`/api/renewals/${vendor}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch renewal data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRenewal();
  }, [vendor]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading renewal steps…</div>;
  if (!data) return <div className="text-sm text-muted-foreground">Failed to load renewal data</div>;

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{data.vendor} – Renewal</h3>
        <a href={data.canonicalUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline">
          View on site
        </a>
      </div>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {data.steps.map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
      <div className="mt-2 text-xs text-muted-foreground">
        Verified {new Date(data.verifiedAt).toLocaleDateString()}
      </div>
    </div>
  );
}