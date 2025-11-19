interface ErrorCardProps {
  error: string;
}

export function ErrorCard({ error }: ErrorCardProps) {
  return (
    <div className="card" style={{ backgroundColor: "#ffe6e6" }}>
      <h3>Error</h3>
      <p>{error}</p>
    </div>
  );
}
