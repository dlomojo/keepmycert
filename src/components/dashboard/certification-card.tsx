import { Calendar, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Certification } from '@/lib/types';

interface CertificationCardProps {
  certification: Certification;
  showAttachment?: boolean;
}

export function CertificationCard({ certification, showAttachment = false }: CertificationCardProps) {
  const getStatusIcon = () => {
    switch (certification.status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'EXPIRING_SOON':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'EXPIRED':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (certification.status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRING_SOON':
        return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{certification.name}</CardTitle>
            <CardDescription>{certification.vendor}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <Badge className={getStatusColor()}>
              {certification.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Expires: {formatDate(certification.expiryDate)}</span>
          </div>
          
          {certification.certificateNumber && (
            <div className="text-sm">
              <span className="font-medium">Certificate #:</span> {certification.certificateNumber}
            </div>
          )}
          
          {showAttachment && certification.attachmentUrl && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <FileText className="h-4 w-4" />
              <span>Certificate file attached</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}