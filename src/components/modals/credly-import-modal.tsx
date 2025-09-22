"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ExternalLink, AlertTriangle } from "lucide-react";

interface CredlyImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Record<string, unknown>, method: string) => void;
  maxCerts: number;
}

export function CredlyImportModal({ isOpen, onClose, onImport, maxCerts }: CredlyImportModalProps) {
  const [activeTab, setActiveTab] = useState<'links' | 'files' | 'profile'>('links');
  const [badgeLinks, setBadgeLinks] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleImport = async () => {
    if (activeTab === 'links' && badgeLinks) {
      const links = badgeLinks.split('\n').filter(link => link.trim());
      onImport({ links }, 'badge_links');
    } else if (activeTab === 'files' && selectedFiles.length > 0) {
      const fileData = [];
      for (const file of selectedFiles) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          fileData.push(data);
        } catch (error) {
          console.error('Failed to parse file:', file.name, error);
        }
      }
      onImport({ files: fileData }, 'badge_files');
    } else if (activeTab === 'profile' && profileUrl) {
      onImport({ profileUrl }, 'profile_url');
    }
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Import from Credly</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Choose your preferred import method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Free Tier Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                Free tier: Maximum {maxCerts} certifications will be imported
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'links' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('links')}
            >
              Badge Links (Recommended)
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'files' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('files')}
            >
              Upload Files
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile URL
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">✅ Most Reliable Method</p>
                <p className="text-xs text-green-700 mt-1">
                  Uses official Open Badge Initiative (OBI) standard. Works for all badges including private ones.
                </p>
              </div>
              
              <div>
                <Label htmlFor="badgeLinks">Badge URLs (one per line)</Label>
                <textarea
                  id="badgeLinks"
                  className="w-full h-32 p-3 border rounded-md resize-none"
                  placeholder="https://www.credly.com/badges/your-badge-id-1&#10;https://www.credly.com/badges/your-badge-id-2"
                  value={badgeLinks}
                  onChange={(e) => setBadgeLinks(e.target.value)}
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">How to get badge links:</p>
                <ol className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>1. Go to your Credly profile</li>
                  <li>2. Click on each badge</li>
                  <li>3. Copy the URL from your browser</li>
                  <li>4. Paste each URL on a new line above</li>
                </ol>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-blue-600 mt-2"
                  onClick={() => window.open("https://www.credly.com", "_blank")}
                >
                  Open Credly <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">✅ 100% Accurate</p>
                <p className="text-xs text-green-700 mt-1">
                  Upload badge files directly from Credly&apos;s &quot;Share&quot; page. Works for all badges.
                </p>
              </div>
              
              <div>
                <Label htmlFor="badgeFiles">Select Badge Files</Label>
                <input
                  id="badgeFiles"
                  type="file"
                  multiple
                  accept=".json"
                  onChange={handleFileSelect}
                  className="w-full p-3 border rounded-md"
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    <ul className="text-xs text-gray-500">
                      {selectedFiles.map((file, index) => (
                        <li key={index}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">How to download badge files:</p>
                <ol className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>1. Go to your badge page on Credly</li>
                  <li>2. Click &quot;Share&quot; button</li>
                  <li>3. Download the badge file (JSON/PNG/SVG)</li>
                  <li>4. Repeat for each badge</li>
                  <li>5. Upload all files above</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800 font-medium">⚠️ Limited Method</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Only works for public badges. Private badges will be missed. May break if Credly changes their system.
                </p>
              </div>
              
              <div>
                <Label htmlFor="profileUrl">Credly Profile URL</Label>
                <Input
                  id="profileUrl"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://www.credly.com/users/your-username"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">Requirements:</p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• Profile must be public</li>
                  <li>• Only public badges will be imported</li>
                  <li>• Private/unlisted badges will be skipped</li>
                </ul>
              </div>
            </div>
          )}

          {/* Privacy Disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              <strong>Privacy Notice:</strong> We don&apos;t store your Credly credentials. Data comes from public sources, 
              Open Badge Initiative (OBI) links, or files you upload directly. No login required.
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleImport}
              disabled={
                (activeTab === 'links' && !badgeLinks.trim()) ||
                (activeTab === 'files' && selectedFiles.length === 0) ||
                (activeTab === 'profile' && !profileUrl.trim())
              }
              className="flex-1"
            >
              Import Badges
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}