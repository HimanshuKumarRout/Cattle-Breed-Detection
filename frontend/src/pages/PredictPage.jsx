import { useState, useRef, useCallback } from 'react';
import { Trash2, X } from 'lucide-react';
import { predictFromFile, predictFromURL, predictFromBase64 } from '../services/api';
import { usePredictionHistory } from '../hooks/usePredictionHistory';
import { useLanguage } from '../context/LanguageContext';

function PredictPage() {
    const { t, formatNum } = useLanguage();
    const [activeTab, setActiveTab] = useState('upload');
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const { history, addPrediction, clearHistory, removePrediction } = usePredictionHistory();

    // File upload handlers
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }
        setSelectedFile(file);
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    // Camera handlers
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setCameraActive(true);
            setError(null);
        } catch (err) {
            setError('Could not access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }
        setCameraActive(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImagePreview(dataUrl);
        stopCamera();
    };

    // Clear
    const clearImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Predict
    const handlePredict = useCallback(async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let response;
            if (activeTab === 'upload' && selectedFile) {
                response = await predictFromFile(selectedFile);
            } else if (activeTab === 'url' && imageUrl) {
                response = await predictFromURL(imageUrl);
            } else if (activeTab === 'camera' && imagePreview) {
                response = await predictFromBase64(imagePreview);
            } else {
                setError('Please provide an image first');
                setLoading(false);
                return;
            }
            setResult(response);
            addPrediction(response, imagePreview);
        } catch (err) {
            setError(err.message || 'Prediction failed');
        } finally {
            setLoading(false);
        }
    }, [activeTab, selectedFile, imageUrl, imagePreview, addPrediction]);

    const getConfidenceClass = (conf) => {
        if (conf >= 0.75) return 'high';
        if (conf >= 0.5) return 'medium';
        return 'low';
    };

    const canPredict = (activeTab === 'upload' && selectedFile) ||
        (activeTab === 'url' && imageUrl.trim()) ||
        (activeTab === 'camera' && imagePreview);

    return (
        <div className="page">
            <h2 className="section-title">{t('predict.title')}</h2>
            <p className="section-subtitle">{t('predict.subtitle')}</p>

            <div className="predict-layout">
                {/* Left: Input panel */}
                <div className="glass-card">
                    <div className="input-tabs">
                        <button className={`input-tab ${activeTab === 'upload' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('upload'); stopCamera(); }}>
                            📁 {t('predict.tabUpload')}
                        </button>
                        <button className={`input-tab ${activeTab === 'camera' ? 'active' : ''}`}
                            onClick={() => setActiveTab('camera')}>
                            📷 {t('predict.tabCamera')}
                        </button>
                        <button className={`input-tab ${activeTab === 'url' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('url'); stopCamera(); }}>
                            🔗 {t('predict.tabUrl')}
                        </button>
                    </div>

                    {/* Upload tab */}
                    {activeTab === 'upload' && (
                        <>
                            <div className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}>
                                <div className="icon">📤</div>
                                <p>{t('predict.dropText')}</p>
                                <p className="hint">{t('predict.supportedFormats')}</p>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileSelect} />
                        </>
                    )}

                    {/* Camera tab */}
                    {activeTab === 'camera' && (
                        <>
                            {!cameraActive && !imagePreview && (
                                <div className="upload-zone" onClick={startCamera}>
                                    <div className="icon">📷</div>
                                    <p><strong>{t('predict.startCamera')}</strong></p>
                                </div>
                            )}
                            {cameraActive && (
                                <div className="camera-container">
                                    <video ref={videoRef} playsInline muted />
                                    <div className="camera-controls">
                                        <button className="camera-capture-btn" onClick={capturePhoto} title={t('predict.takePhoto')} />
                                        <button className="btn-secondary" onClick={stopCamera}>{t('predict.stopCamera')}</button>
                                    </div>
                                </div>
                            )}
                            <canvas ref={canvasRef} hidden />
                        </>
                    )}

                    {/* URL tab */}
                    {activeTab === 'url' && (
                        <>
                            <label style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{t('predict.tabUrl')}</label>
                            <div className="url-input-group">
                                <input
                                    type="url"
                                    placeholder={t('predict.urlPlaceholder')}
                                    value={imageUrl}
                                    onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
                                />
                            </div>
                        </>
                    )}

                    {/* Image preview */}
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button className="remove-btn" onClick={clearImage}>✕</button>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="prediction-warning" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Predict button */}
                    <button className="btn-primary predict-btn" onClick={handlePredict}
                        disabled={!canPredict || loading}>
                        {loading ? t('predict.predictingBtn') : t('predict.predictBtn')}
                    </button>

                    {/* Tips */}
                    <div className="tips-box">
                        <h4>{t('predict.qualityTipsTitle')}</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>• {t('predict.tip1')}</li>
                            <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>• {t('predict.tip2')}</li>
                            <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>• {t('predict.tip3')}</li>
                        </ul>
                    </div>
                </div>

                {/* Right: Results panel */}
                <div>
                    {loading && (
                        <div className="glass-card loading-spinner">
                            <div className="spinner" />
                            <p style={{ color: 'var(--color-text-secondary)' }}>Analyzing image...</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="glass-card result-card">
                            {result.is_valid_cattle_image === false ? (
                                <div style={{ padding: '0.5rem 0' }}>
                                    <div className="prediction-warning-banner" style={{
                                        marginBottom: '1.25rem',
                                        padding: '1rem 1.25rem',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(239, 68, 68, 0.4)',
                                        background: 'rgba(239, 68, 68, 0.12)',
                                        color: '#f87171',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        lineHeight: '1.6'
                                    }}>
                                        ⚠️ <strong>Image Validation Alert:</strong> {result.warning || "Non-cattle image detected."}
                                    </div>
                                    <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚫</div>
                                        <h3 style={{ fontSize: '1.25rem', color: '#f87171', marginBottom: '0.5rem' }}>
                                            No Cattle or Buffalo Detected
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: '420px', margin: '0 auto 1.25rem auto', lineHeight: '1.5' }}>
                                            The AI model identifies 26 indigenous Indian cattle and buffalo breeds from natural photographs. It cannot classify breed information for screenshots, code UIs, or non-animal graphics.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {result.warning && (
                                        <div className="prediction-warning-banner" style={{
                                            marginBottom: '1.25rem',
                                            padding: '0.85rem 1.1rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(245, 158, 11, 0.4)',
                                            background: 'rgba(245, 158, 11, 0.12)',
                                            color: '#fbbf24',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                            lineHeight: '1.5'
                                        }}>
                                            ⚠️ {result.warning}
                                        </div>
                                    )}

                                    <div className="result-header">
                                        <h3 className="result-breed-name">{result.predicted_breed}</h3>
                                        <span className={`result-badge ${getConfidenceClass(result.confidence)}`}>
                                            {formatNum((result.confidence * 100).toFixed(1))}%
                                        </span>
                                    </div>

                                    {/* Confidence bar */}
                                    <div className="confidence-bar-container">
                                        <div className="confidence-bar-label">
                                            <span>Confidence</span>
                                            <span>{formatNum((result.confidence * 100).toFixed(1))}%</span>
                                        </div>
                                        <div className="confidence-bar">
                                            <div className="confidence-bar-fill" style={{ width: `${result.confidence * 100}%` }} />
                                        </div>
                                    </div>

                                    {/* Top K predictions */}
                                    {result.top_k && result.top_k.length > 1 && (
                                        <div className="topk-list">
                                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                                Top Predictions
                                            </h4>
                                            {result.top_k.map((item, idx) => (
                                                <div className="topk-item" key={idx}>
                                                    <span className={`topk-rank ${idx === 0 ? 'first' : ''}`}>{formatNum(idx + 1)}</span>
                                                    <span className="topk-name">{item.breed}</span>
                                                    <span className="topk-conf">{formatNum((item.confidence * 100).toFixed(1))}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Breed info */}
                                    {result.breed_info && (
                                        <>
                                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                Breed Details
                                            </h4>
                                            <div className="breed-info-grid">
                                                <div className="breed-info-item">
                                                    <div className="breed-info-label">Region</div>
                                                    <div className="breed-info-value">{result.breed_info.region}</div>
                                                </div>
                                                <div className="breed-info-item">
                                                    <div className="breed-info-label">Type</div>
                                                    <div className="breed-info-value">{result.breed_info.animal_type}</div>
                                                </div>
                                                <div className="breed-info-item">
                                                    <div className="breed-info-label">Milk Yield</div>
                                                    <div className="breed-info-value">{result.breed_info.avg_milk_liters_per_day} L/day</div>
                                                </div>
                                                <div className="breed-info-item">
                                                    <div className="breed-info-label">Lifespan</div>
                                                    <div className="breed-info-value">{result.breed_info.lifespan_years} years</div>
                                                </div>
                                                <div className="breed-info-item">
                                                    <div className="breed-info-label">Primary Use</div>
                                                    <div className="breed-info-value">{result.breed_info.primary_use}</div>
                                                </div>
                                                <div className="breed-info-item">
                                                    <div className="breed-info-label">Inference</div>
                                                    <div className="breed-info-value">{result.inference_time_ms} ms</div>
                                                </div>
                                            </div>
                                            {result.breed_info.description && (
                                                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                                    {result.breed_info.description}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* History */}
                    {!result && !loading && history.length > 0 && (
                        <div className="glass-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Recent Predictions</h4>
                                <button
                                    onClick={clearHistory}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#ef4444',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        transition: 'background 0.2s',
                                    }}
                                    title="Clear all recent predictions"
                                >
                                    <Trash2 size={14} /> Clear All
                                </button>
                            </div>
                            {history.slice(0, 5).map((entry) => {
                                if (!entry) return null;
                                const confText = typeof entry.confidence === 'number' ? (entry.confidence * 100).toFixed(1) + '%' : '';
                                const dateText = entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : '';
                                const metaText = [confText, dateText].filter(Boolean).join(' · ');

                                return (
                                    <div key={entry.id || Math.random()} className="topk-item">
                                        <span className="topk-name">{entry.predictedBreed || 'Unknown Breed'}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {metaText && <span className="topk-conf">{metaText}</span>}
                                            <button
                                                onClick={() => removePrediction(entry.id)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--color-text-secondary)',
                                                    cursor: 'pointer',
                                                    padding: '2px 4px',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    opacity: 0.7,
                                                    transition: 'opacity 0.2s, color 0.2s',
                                                }}
                                                title="Remove prediction"
                                                onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.opacity = '1'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.opacity = '0.7'; }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PredictPage;
