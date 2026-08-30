import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import HomePage from './pages/HomePage';
import PredictPage from './pages/PredictPage';
import BreedExplorerPage from './pages/BreedExplorerPage';
import AboutPage from './pages/AboutPage';

function AppContent() {
  const { t } = useLanguage();

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-brand">
            🐄 <span>{t('nav.brand')}</span>
          </NavLink>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ul className="nav-links">
              <li><NavLink to="/" end>{t('nav.home')}</NavLink></li>
              <li><NavLink to="/predict">{t('nav.predict')}</NavLink></li>
              <li><NavLink to="/breeds">{t('nav.breeds')}</NavLink></li>
              <li><NavLink to="/about">{t('nav.about')}</NavLink></li>
            </ul>
            <LanguageSelector />
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="/breeds" element={<BreedExplorerPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <footer className="footer">
        <p>
          {t('footer.poweredBy')} · {new Date().getFullYear()} · {t('footer.rights')}
        </p>
      </footer>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
