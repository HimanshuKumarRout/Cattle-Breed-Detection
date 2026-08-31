import en from './en';
import hi from './hi';
import or from './or';

export const translations = {
  en,
  hi,
  or
};

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'or', label: 'ଓଡ଼ିଆ', flag: '🌾' }
];

export function formatDigits(val, lang) {
  if (val === null || val === undefined) return val;
  const str = String(val);
  if (lang === 'hi') {
    const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return str.replace(/[0-9]/g, (digit) => devanagariDigits[parseInt(digit, 10)]);
  }
  if (lang === 'or') {
    const odiaDigits = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];
    return str.replace(/[0-9]/g, (digit) => odiaDigits[parseInt(digit, 10)]);
  }
  return str;
}

export function getNestedTranslation(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
}

export function translate(lang, path, fallback = '') {
  const dict = translations[lang] || translations.en;
  let result = getNestedTranslation(dict, path);
  
  if (result === null) {
    // Fallback to English
    const enResult = getNestedTranslation(translations.en, path);
    result = enResult !== null ? enResult : (fallback || path);
  }

  if (typeof result === 'string') {
    return formatDigits(result, lang);
  }
  
  return result;
}
