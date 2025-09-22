"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ExternalLink, AlertCircle } from "lucide-react";

interface CredlyConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (credlyUrl: string) => void;
  maxCerts: number;
}

export function CredlyConnectModal({ isOpen, onClose, onConnect, maxCerts }: CredlyConnectModalProps) {
  const [credlyUrl, setCredlyUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async () => {
    if (!credlyUrl) return;
    
    setIsConnecting(true);
    try {
      await onConnect(credlyUrl);
      setCredlyUrl("");
      onClose();
    } catch (error) {
      console.error("Failed to connect Credly:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Connect Credly</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Import your digital badges from Credly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                Free tier: Maximum {maxCerts} certifications will be imported
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="credlyUrl">Credly Profile URL</Label>
            <Input
              id="credlyUrl"
              value={credlyUrl}
              onChange={(e) => setCredlyUrl(e.target.value)}
              placeholder="https://www.credly.com/users/your-username"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter your public Credly profile URL
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>How to find your Credly URL:</strong>
            </p>
            <ol className="text-xs text-blue-700 mt-1 space-y-1">
              <li>1. Go to your Credly profile</li>
              <li>2. Make sure your profile is public</li>
              <li>3. Copy the URL from your browser</li>
            </ol>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-blue-600"
              onClick={() => window.open("https://www.credly.com", "_blank")}
            >
              Open Credly <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleConnect}
              disabled={!credlyUrl || isConnecting}
              className="flex-1"
            >
              {isConnecting ? "Connecting..." : "Connect & Import"}
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