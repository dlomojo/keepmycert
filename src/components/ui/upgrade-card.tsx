import { Lock, ArrowRight } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface UpgradeCardProps {
  title: string;
  description: string;
  upgradeMessage: string;
  targetPlan: 'PRO' | 'TEAM';
}

export function UpgradeCard({ title, description, upgradeMessage, targetPlan }: UpgradeCardProps) {
  return (
    <Card className="relative overflow-hidden border-dashed border-2 border-muted-foreground/25">
      <div className="absolute inset-0 bg-muted/50" />
      <CardHeader className="relative">
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-muted-foreground">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{upgradeMessage}</p>
          <Button className="w-full" variant="outline" disabled>
            Upgrade to {targetPlan}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}