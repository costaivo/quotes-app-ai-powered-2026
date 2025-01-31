export default function HomePage() {
  const quoteOfDay = {
    likes: 1,
    dislikes: 0,
    isActive: true,
    _id: '611ba4f0bf79660015b222fc',
    quote: 'If you want to shine like a sun, first burn like a sun.',
    author: 'A. P. J. Abdul Kalam',
    __v: 0,
  };
  return (
      <div className="container mt-4">
        <h1>Quotes App</h1>
        <p><strong>Explore inspiring quotes from famous authors</strong></p>
        <hr></hr>
        <p> <h3 className="text-primary"> Quote of the Day </h3></p>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{quoteOfDay.quote}</h5>
            <p className="card-text">Author: {quoteOfDay.author}</p>
          </div>
        </div>
      </div>
    );
  }