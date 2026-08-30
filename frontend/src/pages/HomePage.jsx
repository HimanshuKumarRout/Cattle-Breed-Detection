import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function HomePage() {
    const { t } = useLanguage();

    return (
        <div className="page">
            <section className="hero">
                <h1>
                    {t('home.heroTitle')}<span className="accent">{t('home.heroTitleAccent')}</span>{t('home.heroTitleEnd')}
                </h1>
                <p>
                    {t('home.heroSubtitle')}
                </p>
                <Link to="/predict">
                    <button className="hero-cta">
                        {t('home.startBtn')}
                    </button>
                </Link>
            </section>

            <section className="features-grid">
                <div className="card feature-card">
                    <div className="feature-icon">📸</div>
                    <h3>{t('home.feature1Title')}</h3>
                    <p>{t('home.feature1Desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🧠</div>
                    <h3>{t('home.feature2Title')}</h3>
                    <p>{t('home.feature2Desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">📋</div>
                    <h3>{t('home.feature3Title')}</h3>
                    <p>{t('home.feature3Desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🌾</div>
                    <h3>{t('home.feature4Title')}</h3>
                    <p>{t('home.feature4Desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>{t('home.feature5Title')}</h3>
                    <p>{t('home.feature5Desc')}</p>
                </div>
                <div className="card feature-card">
                    <div className="feature-icon">🐃</div>
                    <h3>{t('home.feature6Title')}</h3>
                    <p>{t('home.feature6Desc')}</p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
