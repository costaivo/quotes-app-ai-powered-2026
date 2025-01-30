import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuotePage from './pages/QuotePage';
import AuthorPage from './pages/AuthorPage';
import NavbarDark from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <NavbarDark />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quotes" element={<QuotePage />} />
          <Route path="/authors" element={<AuthorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;