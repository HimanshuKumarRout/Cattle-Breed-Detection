import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage, LANGUAGES } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="language-selector-wrapper" ref={dropdownRef}>
      <button 
        type="button"
        className="lang-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Select Language / भाषा चुनें / ଭାଷା ବାଛନ୍ତୁ"
      >
        <Globe size={16} className="globe-icon" />
        <span className="lang-code-label">{currentLangObj.label}</span>
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-option-btn ${language === lang.code ? 'active' : ''}`}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-name">{lang.label}</span>
              {language === lang.code && <Check size={14} className="check-icon" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
