import { createFileRoute, Link } from '@tanstack/react-router'
import { useAppData } from '../hooks/useAppData'
import { VersionCard } from '../components/VersionCard'
import { HealthCard } from '../components/HealthCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorCard } from '../components/ErrorCard'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const { versionInfo, healthStatus, loading, error } = useAppData()

  return (
    <>
      <h1>About - Quotes App AI Powered 2026</h1>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>

      {loading && <LoadingSpinner />}

      {error && <ErrorCard error={error} />}

      {versionInfo && <VersionCard versionInfo={versionInfo} />}

      {healthStatus && <HealthCard healthStatus={healthStatus} />}
    </>
  )
}
