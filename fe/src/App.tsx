import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuotePage from './pages/QuotePage';
import AuthorPage from './pages/AuthorPage';
import NavbarDark from './components/Navbar';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <div className="App">
        <NavbarDark />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quotes" element={<QuotePage />} />
          <Route path="/authors" element={<AuthorPage />} />
          <Route path="/about" element={<AboutPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;