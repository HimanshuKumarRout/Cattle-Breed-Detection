import { useLanguage } from '../context/LanguageContext';

function AboutPage() {
    const { t, formatNum } = useLanguage();

    return (
        <div className="page">
            <h2 className="section-title">{t('about.title')}</h2>
            <p className="section-subtitle">
                {t('about.subtitle')}
            </p>

            <div className="about-grid">
                <div className="card about-card" style={{ gridColumn: '1 / -1' }}>
                    <h3>{t('about.dlTitle')}</h3>
                    <p>
                        {t('about.dlDesc')}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                            <h4 style={{ color: '#818cf8', marginTop: 0, marginBottom: '0.5rem' }}>{t('about.resnetTitle')}</h4>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                {t('about.resnetDesc')}
                            </p>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', margin: 0 }}>
                                <li><strong>{t('about.top1AccLabel')}:</strong> {formatNum('63.2%')}</li>
                                <li><strong>{t('about.macroF1Label')}:</strong> {formatNum('56.0%')}</li>
                                <li><strong>{t('about.infSpeedLabel')}:</strong> {formatNum('5.7')} {t('about.msPerImage')}</li>
                                <li><strong>{t('about.modelSizeLabel')}:</strong> {formatNum('93.7')} MB</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                            <h4 style={{ color: '#34d399', marginTop: 0, marginBottom: '0.5rem' }}>{t('about.vitTitle')}</h4>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                {t('about.vitDesc')}
                            </p>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', margin: 0 }}>
                                <li><strong>{t('about.top1AccLabel')}:</strong> {formatNum('63.2%')}</li>
                                <li><strong>{t('about.macroF1Label')}:</strong> {formatNum('55.0%')}</li>
                                <li><strong>{t('about.infSpeedLabel')}:</strong> {formatNum('15.5')} {t('about.msPerImage')}</li>
                                <li><strong>{t('about.modelSizeLabel')}:</strong> {formatNum('328.9')} MB</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                            <h4 style={{ color: '#fbbf24', marginTop: 0, marginBottom: '0.5rem' }}>{t('about.cnnTitle')}</h4>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                {t('about.cnnDesc')}
                            </p>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', margin: 0 }}>
                                <li><strong>{t('about.top1AccLabel')}:</strong> {formatNum('24.4%')}</li>
                                <li><strong>{t('about.macroF1Label')}:</strong> {formatNum('14.0%')}</li>
                                <li><strong>{t('about.infSpeedLabel')}:</strong> {formatNum('2.4')} {t('about.msPerImage')}</li>
                                <li><strong>{t('about.modelSizeLabel')}:</strong> {formatNum('18.5')} MB</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                            <h4 style={{ color: '#f87171', marginTop: 0, marginBottom: '0.5rem' }}>{t('about.mlpTitle')}</h4>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                {t('about.mlpDesc')}
                            </p>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', margin: 0 }}>
                                <li><strong>{t('about.top1AccLabel')}:</strong> {formatNum('24.0%')}</li>
                                <li><strong>{t('about.macroF1Label')}:</strong> {formatNum('13.0%')}</li>
                                <li><strong>{t('about.infSpeedLabel')}:</strong> {formatNum('2.5')} {t('about.msPerImage')}</li>
                                <li><strong>{t('about.modelSizeLabel')}:</strong> {formatNum('590.5')} MB</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="card about-card">
                    <h3>{t('about.strategyTitle')}</h3>
                    <p>
                        {t('about.strategyDesc')}
                    </p>
                    <ul>
                        <li>{t('about.phase1')}</li>
                        <li>{t('about.phase2')}</li>
                        <li>{t('about.optimization')}</li>
                        <li>{t('about.lossFunc')}</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>{t('about.datasetTitle')}</h3>
                    <p>
                        {t('about.datasetDesc')}
                    </p>
                    <ul>
                        <li>{t('about.standardization')}</li>
                        <li>{t('about.augmentation')}</li>
                        <li>{t('about.qa')}</li>
                        <li>{t('about.breedsCovered')}</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>{t('about.matrixTitle')}</h3>
                    <p>{t('about.matrixDesc')}</p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        <div className="breed-card-detail"><span className="label">{t('about.f1Score')}</span><span className="value">{formatNum('50%')}</span></div>
                        <div className="breed-card-detail"><span className="label">{t('about.top1Acc')}</span><span className="value">{formatNum('20%')}</span></div>
                        <div className="breed-card-detail"><span className="label">{t('about.latency')}</span><span className="value">{formatNum('15%')}</span></div>
                        <div className="breed-card-detail"><span className="label">{t('about.modelSize')}</span><span className="value">{formatNum('10%')}</span></div>
                        <div className="breed-card-detail"><span className="label">{t('about.calibration')}</span><span className="value">{formatNum('5%')}</span></div>
                    </div>
                </div>

                <div className="card about-card">
                    <h3>{t('about.techTitle')}</h3>
                    <ul>
                        <li>{t('about.dlStack')}</li>
                        <li>{t('about.backendStack')}</li>
                        <li>{t('about.frontendStack')}</li>
                        <li>{t('about.deployStack')}</li>
                        <li>{t('about.mlopsStack')}</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>{t('about.fieldTitle')}</h3>
                    <p>
                        {t('about.fieldDesc')}
                    </p>
                    <ul>
                        <li>{t('about.fieldPoint1')}</li>
                        <li>{t('about.fieldPoint2')}</li>
                        <li>{t('about.fieldPoint3')}</li>
                        <li>{t('about.fieldPoint4')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
