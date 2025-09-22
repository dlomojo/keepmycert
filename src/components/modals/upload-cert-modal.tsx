"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, CheckCircle, AlertCircle, FileText, Edit } from "lucide-react";

interface UploadCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadCertModal({ isOpen, onClose, onSuccess }: UploadCertModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadMode, setUploadMode] = useState<'manual' | 'pdf'>('manual');
  const [pdfData, setPdfData] = useState<{
    title?: string;
    issuer?: string;
    acquiredOn?: string;
    expiresOn?: string;
    certificateNumber?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      // Convert FormData to JSON for /api/certs endpoint
      const data = {
        title: formData.get('title') as string,
        issuer: formData.get('vendor') as string,
        acquiredOn: formData.get('issueDate') as string,
        expiresOn: formData.get('expiryDate') as string,
        certificateNumber: formData.get('certificateNumber') as string || undefined
      };

      const response = await fetch('/api/certs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('API Response:', { status: response.status, result });

      if (!response.ok) {
        console.error('API Error:', result);
        if (result.error === 'UPGRADE_REQUIRED') {
          setError('You\'ve reached your certification limit. Upgrade to Pro for unlimited certificates!');
        } else {
          setError(result.message || result.error || `API Error: ${response.status}`);
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 1500);

    } catch (error) {
      console.error('Network Error:', error instanceof Error ? error.message : 'Unknown error');
      setError('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Add Certificate
              </CardTitle>
              <CardDescription>
                Upload PDF or enter details manually
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <p className="text-lg font-medium">Certificate Added Successfully!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upload Mode Selection */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <Button
                  type="button"
                  variant={uploadMode === 'manual' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setUploadMode('manual')}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Manual Entry
                </Button>
                <Button
                  type="button"
                  variant={uploadMode === 'pdf' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setUploadMode('pdf')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Upload PDF
                </Button>
              </div>

              {uploadMode === 'pdf' ? (
                <PDFUploadForm 
                  onSuccess={(data) => {
                    setPdfData(data);
                    setUploadMode('manual');
                  }}
                  onError={setError}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Certificate Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., AWS Solutions Architect"
                  defaultValue={pdfData?.title || ''}
                  required
                />
              </div>

              <div>
                <Label htmlFor="vendor">Vendor *</Label>
                <Input
                  id="vendor"
                  name="vendor"
                  placeholder="e.g., Amazon Web Services"
                  defaultValue={pdfData?.issuer || ''}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    defaultValue={pdfData?.acquiredOn || ''}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    defaultValue={pdfData?.expiresOn || ''}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="certificateNumber">Certificate Number</Label>
                <Input
                  id="certificateNumber"
                  name="certificateNumber"
                  placeholder="Optional"
                  defaultValue={pdfData?.certificateNumber || ''}
                />
              </div>
              
              {pdfData && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  ✓ Certificate information extracted from PDF. Please review and edit if needed.
                </div>
              )}

              {error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {error}
                </div>
              )}

                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? 'Adding...' : 'Add Certificate'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PDFUploadForm({ onSuccess, onError, isLoading, setIsLoading }: {
  onSuccess: (data: {
    title?: string;
    issuer?: string;
    acquiredOn?: string;
    expiresOn?: string;
    certificateNumber?: string;
  }) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      onError('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError('File size must be less than 10MB');
      return;
    }

    setIsLoading(true);
    onError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse document');
      }

      onSuccess(result.data);
    } catch (error) {
      console.error('PDF parse error:', error instanceof Error ? error.message : 'Unknown error');
      onError('Failed to parse PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        } ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:border-gray-400'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium mb-2">
          {isLoading ? 'Processing PDF...' : 'Drop your PDF certificate here'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse (Max 10MB)
        </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
          id="pdf-upload"
          disabled={isLoading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('pdf-upload')?.click()}
          disabled={isLoading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose PDF File
        </Button>
      </div>
      
      {isLoading && (
        <div className="text-center text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Extracting certificate information...
        </div>
      )}
    </div>
  );
}