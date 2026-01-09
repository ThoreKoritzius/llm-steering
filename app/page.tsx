import Link from "next/link";

export default function Home() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Model Steering Visualization
          </h1>
          <p className="hero-description">
            Explore how steering vectors influence language model behavior without changing prompts.
            Visualize token probability shifts, compare steering to prompting, and understand the
            internal mechanics of model control.
          </p>
          <div className="hero-actions">
            <Link href="/viewer" className="btn btn-primary">
              Launch Viewer
            </Link>
            <Link href="/concept" className="btn btn-secondary">
              Learn the Concept
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Capabilities</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Steering Sweeps</h3>
            <p>
              Visualize how different steering coefficients affect model outputs. See
              token-by-token probability changes with color-coded visualizations.
            </p>
          </div>

          <div className="feature-card">
            <h3>Baseline Comparisons</h3>
            <p>
              Compare steering effects to traditional prompt engineering. Understand when
              steering can reproduce prompt-based interventions.
            </p>
          </div>

          <div className="feature-card">
            <h3>Architecture View</h3>
            <p>
              Explore the transformer architecture with highlighted steering injection points.
              See exactly where in the network steering is applied.
            </p>
          </div>

          <div className="feature-card">
            <h3>Live Metrics</h3>
            <p>
              Track entropy shifts and target phrase log probabilities across coefficient
              sweeps. Real-time plot updates as you explore.
            </p>
          </div>

          <div className="feature-card">
            <h3>Vector Analysis</h3>
            <p>
              Examine steering vector distributions with histogram visualizations. Understand
              the sparse structure of learned steering directions.
            </p>
          </div>

          <div className="feature-card">
            <h3>Interactive Interface</h3>
            <p>
              Modern, responsive design with smooth animations. Built with Next.js and
              TypeScript for a professional research experience.
            </p>
          </div>
        </div>
      </section>

      <section className="demo-section">
        <h2 className="section-title">Included Demo</h2>
        <div className="demo-content">
          <div className="demo-info">
            <h3>Gemma2 Steering Experiment</h3>
            <p>
              The viewer comes pre-loaded with a complete steering experiment on
              <strong> Gemma2-9B-IT</strong> at layer 20.
            </p>
            <ul className="demo-list">
              <li>
                <strong>548 KB</strong> of steering sweep data with coefficient variations
              </li>
              <li>
                <strong>61 KB</strong> baseline comparison showing prompt-based interventions
              </li>
              <li>
                <strong>3,584</strong>-dimensional steering vector from GemmaScope
              </li>
            </ul>
            <p className="demo-note">
              Load your own experiments by uploading JSON files through the viewer interface.
            </p>
          </div>
          <div className="demo-visual">
            <div className="demo-box">
              <div className="demo-box-header">Sample Data Included</div>
              <div className="demo-box-content">
                <div className="demo-item">
                  <span className="demo-label">steering_run.json</span>
                  <span className="demo-value">548 KB</span>
                </div>
                <div className="demo-item">
                  <span className="demo-label">prompt_baseline.json</span>
                  <span className="demo-value">61 KB</span>
                </div>
                <div className="demo-item">
                  <span className="demo-label">steer_vector.json</span>
                  <span className="demo-value">86 KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to explore?</h2>
        <p>Start analyzing steering experiments in your browser</p>
        <Link href="/viewer" className="btn btn-primary btn-large">
          Open Viewer
        </Link>
      </section>
    </div>
  );
}
