import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorCardProps {
  error: string;
}

export function ErrorCard({ error }: ErrorCardProps) {
  return (
    <Card className="flex-1 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <CardTitle className="text-lg text-red-900 dark:text-red-100">Error</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
      </CardContent>
    </Card>
  );
}
