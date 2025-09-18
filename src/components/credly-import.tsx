"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Badge {
  id: string;
  name: string;
  issuer: string;
}

interface ImportResult {
  badges?: Badge[];
  count?: number;
  error?: string;
}

export default function CredlyImport() {
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/credly/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl })
      });

      const data = await response.json();
      setResult(data);
      
      if (data.badges?.length > 0) {
        // Here you would typically save to database
        console.log(`Found ${data.badges.length} badges:`, data.badges);
      }
    } catch (error) {
      console.error('Import failed:', error);
      setResult({ error: 'Import failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Import from Credly
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <input
              type="url"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="Paste your Credly profile URL"
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading || !profileUrl.trim()}>
            {loading ? 'Importing...' : 'Import Badges'}
          </Button>
        </form>

        {result && (
          <div className="mt-4 p-3 border rounded-md">
            {result.error ? (
              <p className="text-red-600">Error: {result.error}</p>
            ) : (
              <div>
                <p className="text-green-600">
                  Successfully found {result.count} badges!
                </p>
                {result.badges?.slice(0, 3).map((badge: Badge) => (
                  <div key={badge.id} className="mt-2 text-sm">
                    • {badge.name} from {badge.issuer}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="mt-2 text-xs text-muted-foreground">
          Trouble? This uses Credly&apos;s public API which may have limitations.
        </p>
      </CardContent>
    </Card>
  );
}