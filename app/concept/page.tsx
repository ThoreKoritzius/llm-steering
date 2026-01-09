import Link from "next/link";

export default function ConceptPage() {
  return (
    <div className="concept-page">
      <div className="concept-container">
        <header className="concept-header">
          <h1>What is Model Steering?</h1>
          <p className="concept-lead">
            Understanding how to control language models without changing prompts
          </p>
        </header>

        <section className="concept-section">
          <h2>The Core Idea</h2>
          <p>
            <strong>Model steering</strong> is a technique for influencing a language model's behavior
            by directly modifying its internal activations, rather than by changing the input prompt.
            Think of it as "nudging" the model from the inside.
          </p>
          <div className="concept-box highlight">
            <p>
              <strong>Key insight:</strong> Instead of asking the model to "act like a cat" in the prompt,
              we can inject a learned "cat direction" into the model's hidden states to achieve similar effects.
            </p>
          </div>
        </section>

        <section className="concept-section">
          <h2>Steering vs. Prompting</h2>
          <div className="comparison-grid">
            <div className="comparison-card prompting">
              <h3>Traditional Prompting</h3>
              <div className="comparison-content">
                <p><strong>How it works:</strong></p>
                <p>
                  Add instructions to the input text like "You are a helpful assistant" or
                  "Please respond in a formal tone."
                </p>
                <p><strong>What changes:</strong></p>
                <ul>
                  <li>The model sees different input tokens</li>
                  <li>Output distribution shifts based on prompt context</li>
                  <li>Works through the model's normal text processing</li>
                </ul>
                <p><strong>Limitations:</strong></p>
                <ul>
                  <li>Uses up context window space</li>
                  <li>Model may ignore instructions</li>
                  <li>Difficult to fine-tune the strength of effect</li>
                </ul>
              </div>
            </div>

            <div className="comparison-card steering">
              <h3>Model Steering</h3>
              <div className="comparison-content">
                <p><strong>How it works:</strong></p>
                <p>
                  Inject a learned vector directly into the model's hidden states at a
                  specific layer during the forward pass.
                </p>
                <p><strong>What changes:</strong></p>
                <ul>
                  <li>Internal activation patterns are modified</li>
                  <li>Output distribution shifts without prompt changes</li>
                  <li>Bypasses normal token processing</li>
                </ul>
                <p><strong>Advantages:</strong></p>
                <ul>
                  <li>No context window usage</li>
                  <li>Precise control with coefficient tuning</li>
                  <li>Can achieve effects hard to prompt for</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="concept-section">
          <h2>How Steering Works</h2>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Learn a Direction</h3>
                <p>
                  Identify a direction in activation space that corresponds to a desired behavior.
                  This is typically done by comparing model states with and without certain behaviors.
                </p>
                <p className="step-example">
                  Example: Find the "sycophancy direction" by comparing responses when the model
                  agrees vs. disagrees with the user.
                </p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Choose a Layer</h3>
                <p>
                  Select which transformer layer to inject the steering vector into. Different
                  layers can produce different effects—earlier layers affect lower-level features,
                  later layers affect higher-level semantics.
                </p>
                <p className="step-example">
                  Example: Layer 20 in Gemma2-9B (middle of the 42-layer stack) often works well
                  for behavioral steering.
                </p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Apply with Coefficient</h3>
                <p>
                  During inference, add the steering vector (scaled by a coefficient) to the hidden
                  states at the chosen layer. The coefficient controls the strength of the effect.
                </p>
                <p className="step-example">
                  Example: coefficient = 0.0 means no steering, coefficient = 10.0 means strong
                  steering in that direction.
                </p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Observe Effects</h3>
                <p>
                  The modified activations propagate through the rest of the network, changing
                  the final output distribution. Token probabilities shift without any prompt changes.
                </p>
                <p className="step-example">
                  Example: With cat-steering applied, the model becomes more likely to use
                  cat-related words even with a neutral prompt.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="concept-section">
          <h2>Understanding the Visualization</h2>
          <div className="visual-guide">
            <div className="visual-item">
              <div className="visual-color-box red"></div>
              <div className="visual-text">
                <strong>Red tokens:</strong> More likely under steering/prompting
              </div>
            </div>
            <div className="visual-item">
              <div className="visual-color-box blue"></div>
              <div className="visual-text">
                <strong>Blue tokens:</strong> Less likely under steering/prompting
              </div>
            </div>
            <div className="visual-item">
              <div className="visual-color-box neutral"></div>
              <div className="visual-text">
                <strong>Neutral tokens:</strong> Probability unchanged
              </div>
            </div>
          </div>
          <p>
            Each token in the generated text is colored by how much its log probability changed
            (Δ logprob) compared to the baseline. This makes the steering effect visible at a glance.
          </p>
        </section>

        <section className="concept-section">
          <h2>Research Applications</h2>
          <div className="applications-grid">
            <div className="application-card">
              <h3>Safety Research</h3>
              <p>
                Identify and mitigate harmful behaviors by steering models away from dangerous
                outputs without retraining.
              </p>
            </div>
            <div className="application-card">
              <h3>Interpretability</h3>
              <p>
                Understand what different activation directions represent by observing how
                steering along them changes model behavior.
              </p>
            </div>
            <div className="application-card">
              <h3>Control</h3>
              <p>
                Fine-tune model behavior for specific tasks or tones without fine-tuning
                the entire model.
              </p>
            </div>
            <div className="application-card">
              <h3>Analysis</h3>
              <p>
                Compare steering to prompting to understand how models process instructions
                versus internal biases.
              </p>
            </div>
          </div>
        </section>

        <section className="concept-section cta-section">
          <h2>Try it yourself</h2>
          <p>
            Use the viewer to explore a real steering experiment on Gemma2-9B. See how different
            coefficients affect output probabilities and compare steering to prompt baselines.
          </p>
          <Link href="/viewer" className="btn btn-primary btn-large">
            Open Viewer
          </Link>
        </section>
      </div>
    </div>
  );
}
