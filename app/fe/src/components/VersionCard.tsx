import type { VersionInfo } from "../types/api";

interface VersionCardProps {
  versionInfo: VersionInfo;
}

export function VersionCard({ versionInfo }: VersionCardProps) {
  return (
    <div className="card">
      <h3>Application Version</h3>
      <p>
        <strong>Name:</strong> {versionInfo.name}
      </p>
      <p>
        <strong>Version:</strong> {versionInfo.version}
      </p>
      <p>
        <strong>Description:</strong> {versionInfo.description}
      </p>
    </div>
  );
}
