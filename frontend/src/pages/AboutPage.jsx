function AboutPage() {
    return (
        <div className="page">
            <h2 className="section-title">About CattleAI</h2>
            <p className="section-subtitle">
                An advanced deep learning framework and encyclopedia for 34 indigenous Indian cattle and buffalo breeds.
            </p>

            <div className="about-grid">
                <div className="card about-card" style={{ gridColumn: '1 / -1' }}>
                    <h3>🧠 Deep Learning Architectures in CattleAI</h3>
                    <p>
                        Our project implements and empirically compares <strong>four deep learning model architectures</strong> to solve fine-grained livestock breed classification across 26 target classes (21 Cow + 5 Buffalo breeds):
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                            <h4 style={{ color: '#818cf8', marginTop: 0, marginBottom: '0.5rem' }}>🏆 ResNet-50 (Production Model)</h4>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <strong>Transfer Learning Backbone:</strong> Pre-trained ImageNet-1K feature extractor fine-tuned with a custom two-stage classification head (Dropout → Linear 512 → ReLU → Linear 26).
                            </p>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', margin: 0 }}>
                                <li><strong>Top-1 Accuracy:</strong> 63.2%</li>
                                <li><strong>Macro F1 Score:</strong> 56.0%</li>
                                <li><strong>Inference Speed:</strong> 5.7 ms / image</li>
                                <li><strong>Model Size:</strong> 93.7 MB</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                            <h4 style={{ color: '#34d399', marginTop: 0, marginBottom: '0.5rem' }}>👁️ Vision Transformer (ViT-B/16)</h4>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <strong>Self-Attention Network:</strong> Divides images into 16×16 patch embeddings using <code>vit_base_patch16_224</code> via PyTorch <code>timm</code> to capture global spatial features (horns, humps, coat).
                            </p>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', margin: 0 }}>
                                <li><strong>Top-1 Accuracy:</strong> 63.2%</li>
                                <li><strong>Macro F1 Score:</strong> 55.0%</li>
                                <li><strong>Inference Speed:</strong> 15.5 ms / image</li>
                                <li><strong>Model Size:</strong> 328.9 MB</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                            <h4 style={{ color: '#fbbf24', marginTop: 0, marginBottom: '0.5rem' }}>⚡ Custom 5-Block CNN</h4>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <strong>Trained from Scratch:</strong> Lightweight 5-layer Convolutional Neural Network with Batch Normalization, ReLU activations, and Max Pooling.
                            </p>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', margin: 0 }}>
                                <li><strong>Top-1 Accuracy:</strong> 24.4%</li>
                                <li><strong>Macro F1 Score:</strong> 14.0%</li>
                                <li><strong>Inference Speed:</strong> 2.4 ms / image</li>
                                <li><strong>Model Size:</strong> 18.5 MB</li>
                            </ul>
                        </div>

                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '1rem' }}>
                            <h4 style={{ color: '#f87171', marginTop: 0, marginBottom: '0.5rem' }}>📐 Multi-Layer Perceptron (MLP)</h4>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <strong>Baseline Architecture:</strong> Fully-connected dense neural network operating on flattened pixel vectors to quantify spatial feature extraction benefits.
                            </p>
                            <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', margin: 0 }}>
                                <li><strong>Top-1 Accuracy:</strong> 24.0%</li>
                                <li><strong>Macro F1 Score:</strong> 13.0%</li>
                                <li><strong>Inference Speed:</strong> 2.5 ms / image</li>
                                <li><strong>Model Size:</strong> 590.5 MB</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="card about-card">
                    <h3>🔬 Training & Transfer Learning Strategy</h3>
                    <p>
                        A two-phase training strategy is executed to adapt pre-trained deep learning backbones while preserving high-level visual features:
                    </p>
                    <ul>
                        <li><strong>Phase 1 (Frozen Backbone):</strong> Train custom classification head while keeping backbone parameters frozen.</li>
                        <li><strong>Phase 2 (Selective Fine-tuning):</strong> Unfreeze top layers (e.g. <code>layer3</code>, <code>layer4</code> in ResNet) with differential learning rates.</li>
                        <li><strong>Optimization:</strong> AdamW optimizer with Cosine Annealing learning rate schedule.</li>
                        <li><strong>Loss Function:</strong> Cross-Entropy loss with label smoothing to handle noisy field images.</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>📊 Dataset & Preprocessing</h3>
                    <p>
                        3,056 curated images across 26 indigenous Indian breeds (21 Cow + 5 Buffalo breeds) with a 70/15/15 stratified train/val/test split.
                    </p>
                    <ul>
                        <li><strong>Standardization:</strong> Resized to 224×224 RGB with ImageNet mean & std normalization.</li>
                        <li><strong>Data Augmentation:</strong> Random horizontal flips, rotation (±15°), color jittering, and random cropping.</li>
                        <li><strong>Quality Assurance:</strong> Automated corrupt image detection and audit during preprocessing.</li>
                        <li><strong>Breeds Covered:</strong> Gir, Sahiwal, Kankrej, Tharparkar, Banni, Murrah, Mehsana & 19 more.</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>🎯 Best Model Scoring Matrix</h3>
                    <p>Production deployment automatically selects the best candidate via a multi-metric weighted score:</p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        <div className="breed-card-detail"><span className="label">Macro F1 Score (Class Balance)</span><span className="value">50%</span></div>
                        <div className="breed-card-detail"><span className="label">Top-1 Classification Accuracy</span><span className="value">20%</span></div>
                        <div className="breed-card-detail"><span className="label">Inference Latency (Speed)</span><span className="value">15%</span></div>
                        <div className="breed-card-detail"><span className="label">Model Storage Size</span><span className="value">10%</span></div>
                        <div className="breed-card-detail"><span className="label">Confidence Calibration</span><span className="value">5%</span></div>
                    </div>
                </div>

                <div className="card about-card">
                    <h3>⚙️ Tech Stack & Architecture</h3>
                    <ul>
                        <li><strong>Deep Learning:</strong> PyTorch 2.x, torchvision, <code>timm</code> library</li>
                        <li><strong>Backend API:</strong> FastAPI, Uvicorn, Pydantic, Pillow</li>
                        <li><strong>Frontend UI:</strong> React 18, Vite, Modern CSS Glassmorphism</li>
                        <li><strong>Deployment:</strong> Containerized Docker architecture</li>
                        <li><strong>MLOps Pipeline:</strong> Automated YAML experiment tracking & Colab GPU training</li>
                    </ul>
                </div>

                <div className="card about-card">
                    <h3>🌾 Agricultural & Field Features</h3>
                    <p>
                        Engineered for practical real-world agricultural use by farmers and veterinarians:
                    </p>
                    <ul>
                        <li>Instant camera image upload and real-time inference</li>
                        <li>Low-confidence fallback warnings for uncertain or out-of-distribution images</li>
                        <li>Detailed breed encyclopedia: milk yield, region of origin, primary purpose, lifespan</li>
                        <li>Image quality guidelines to help users capture optimal photos</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;
