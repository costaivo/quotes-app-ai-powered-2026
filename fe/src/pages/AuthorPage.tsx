import { Link } from "react-router-dom";

export default function AuthorPage() {
  const authors = [
    "A. P. J. Abdul Kalam",
    "Gandhi",
    "Ivo Costa",
    "Jakob",
    "John Lennon",
    "Lao-Tze",
    "Larry Niven",
    "Linnie",
    "Martin Fowler",
    "Michael Feathers",
    "Michael Jordan",
    "Nelson Mandela",
    "Ivo Costa",
    "Steve Jobs",
    "Steve Jobs",
  ];

  return (
    <div className="container mt-4">
      <h1>Authors</h1>
      <ul className="list-group mt-3">
        {authors.map((author, index) => (
          <li className="list-group-item" key={index}>
             <Link to='/quote'>{author}</Link></li>
        ))}
      </ul>
    </div>
  );
}