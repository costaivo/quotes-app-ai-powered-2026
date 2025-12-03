import { createFileRoute } from '@tanstack/react-router';
import { useAppData } from '../hooks/useAppData';
import { VersionCard } from '../components/VersionCard';
import { HealthCard } from '../components/HealthCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorCard } from '../components/ErrorCard';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  const { versionInfo, healthStatus, loading, error } = useAppData();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">About - Quotes App AI Powered 2026</h1>

        {loading && <LoadingSpinner />}

        {error && (
          <div className="mb-8">
            <ErrorCard error={error} />
          </div>
        )}

        {!loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {versionInfo && <VersionCard versionInfo={versionInfo} />}
            {healthStatus && <HealthCard healthStatus={healthStatus} />}
          </div>
        )}
      </div>
    </div>
  );
}
