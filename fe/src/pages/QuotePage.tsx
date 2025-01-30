export default function QuotePage() {
    return (
      <div className="container mt-4">
        <h1>Random Quote</h1>
        <div className="card mt-3">
          <div className="card-body">
            <blockquote className="blockquote mb-0">
              <p>Quote content will appear here...</p>
              <footer className="blockquote-footer mt-2">Author name</footer>
            </blockquote>
          </div>
        </div>
      </div>
    );
  }