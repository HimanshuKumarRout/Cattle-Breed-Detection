function AboutPage() {
    return (
        <div className="page">
            <h2 className="section-title">About CattleAI</h2>
            <p className="section-subtitle">
                An AI-powered cattle breed classification system for Indian indigenous breeds.
            </p>

            <div className="about-grid">
                <div className="card about-card">
                    <h3>🧠 Deep Learning Model</h3>
                    <p>Powered by the EfficientNet-B3 deep learning architecture:</p>
                    <ul>
                        <li><strong>EfficientNet-B3 Transfer Learning</strong> — ImageNet pretrained backbone</li>
                        <li>Compound scaling for optimal depth, width, and resolution balance</li>
                        <li>Fine-tuned for 26 indigenous Indian cattle and buffalo breeds</li>
                        <li>Optimized for fast, sub-second inference performance</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>📊 The Dataset</h3>
                    <p>
                        3,056 images across 26 indigenous Indian breeds (21 cow + 5 buffalo breeds).
                        Stratified 70/15/15 train/val/test split.
                    </p>
                    <ul>
                        <li>Images resized to 224×224 pixels</li>
                        <li>Augmentation: flip, rotation, jitter, crop</li>
                        <li>ImageNet normalization applied</li>
                        <li>Corrupt image validation at preprocessing</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>⚙️ Tech Stack</h3>
                    <ul>
                        <li>PyTorch 2.x + torchvision + timm</li>
                        <li>FastAPI backend with Pydantic schemas</li>
                        <li>React + Vite frontend</li>
                        <li>Docker containerized deployment</li>
                        <li>Config-driven experiments with YAML</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>🎯 Best Model Selection</h3>
                    <p>Weighted scoring ensures the production model balances performance and practicality:</p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        <div className="breed-card-detail"><span className="label">Macro F1</span><span className="value">50%</span></div>
                        <div className="breed-card-detail"><span className="label">Top-1 Accuracy</span><span className="value">20%</span></div>
                        <div className="breed-card-detail"><span className="label">Inference Latency</span><span className="value">15%</span></div>
                        <div className="breed-card-detail"><span className="label">Model Size</span><span className="value">10%</span></div>
                        <div className="breed-card-detail"><span className="label">Calibration</span><span className="value">5%</span></div>
                    </div>
                </div>

                <div className="card about-card">
                    <h3>🌾 For Farmers</h3>
                    <p>
                        This tool is designed for real-world agricultural use. Features include:
                    </p>
                    <ul>
                        <li>Camera capture for field use</li>
                        <li>Low-confidence warnings for uncertain predictions</li>
                        <li>Image quality tips for better results</li>
                        <li>Breed details including milk yield and primary use</li>
                        <li>Works offline after initial load (PWA-ready)</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>👤 Creator</h3>
                    <p>
                        Indigenous Cattle & Buffalo Breed Classifier.
                    </p>
                    <ul style={{ marginTop: '0.5rem' }}>
                        <li>Backend: FastAPI with PyTorch inference</li>
                        <li>Frontend: React + Vite</li>
                        <li>Training: Jupyter notebooks with shared ML package</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
