import type { VersionInfo } from '../types/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface VersionCardProps {
  versionInfo: VersionInfo;
}

export function VersionCard({ versionInfo }: VersionCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5" />
          Application Version
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{versionInfo.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Version</p>
          <p className="font-medium">{versionInfo.version}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Description</p>
          <p className="text-sm">{versionInfo.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
