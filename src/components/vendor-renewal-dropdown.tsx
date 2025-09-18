"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VENDORS } from '@/lib/vendors';
import { ExternalLink, ChevronDown } from 'lucide-react';

export default function VendorRenewalDropdown() {
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const vendorKeys = Object.keys(VENDORS);
  const selectedVendorData = selectedVendor ? VENDORS[selectedVendor as keyof typeof VENDORS] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Renewal Advice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Vendor Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-background hover:bg-accent"
            >
              <span className={selectedVendor ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedVendor ? VENDORS[selectedVendor as keyof typeof VENDORS].name : 'Select a vendor...'}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {vendorKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedVendor(key);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-accent"
                  >
                    {VENDORS[key as keyof typeof VENDORS].name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Renewal Steps */}
          {selectedVendorData && (
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Renewal Steps:</h4>
                <ul className="space-y-1">
                  {selectedVendorData.steps.map((step, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="mr-2 mt-1 h-1 w-1 bg-muted-foreground rounded-full flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(selectedVendorData.url, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit {selectedVendorData.name} Renewal Page
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}