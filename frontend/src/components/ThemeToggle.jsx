import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className={`theme-toggle-icon ${isDark ? 'is-dark' : 'is-light'}`}>
        {isDark ? <Sun className="icon-sun" size={18} /> : <Moon className="icon-moon" size={18} />}
      </div>
      <span className="theme-toggle-label">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
