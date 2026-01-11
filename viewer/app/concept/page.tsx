"use client";

import Link from "next/link";
import { useState } from "react";

export default function ConceptPage() {
  const defaultDescription =
    "Hover each part of the formula to see what it represents and how we obtain it.";
  const [activeDescription, setActiveDescription] = useState(defaultDescription);

  const setDesc = (text: string) => () => setActiveDescription(text);
  const resetDesc = () => setActiveDescription(defaultDescription);
  const layerCount = 15;
  const hookLayerIndex = 9; // using LAYER = 9 from the example notebook (zero-based)

  return (
    <div className="concept-page">
      <div className="concept-sheet">
        <header className="concept-hero">
          <span className="concept-eyebrow">Concept Note</span>
          <h1>Model Steering</h1>
          <p className="concept-lead">
            A concise summary of how steering uses sparse autoencoder features to shift a model's
            internal activations without changing the prompt.
          </p>
          <p className="concept-source">
            Based on Neuronpedia's SAE feature work. Reference:{" "}
            <a href="https://www.neuronpedia.org/" target="_blank" rel="noreferrer">
              neuronpedia.org
            </a>
          </p>
        </header>

        <section className="concept-section concept-definition">
          <div className="concept-section-header full">
            <h2>Definition</h2>
          </div>
          <div className="concept-definition-grid">
            <div className="concept-formula-card">
              <div className="concept-formula-title">Steering update</div>
              <div className="concept-formula-math">
                <span
                  className="concept-formula-var concept-formula-term"
                  onMouseEnter={setDesc("h_l′ is the steered layer output returned by the hook.")}
                  onMouseLeave={resetDesc}
                >
                  h<sub>l</sub>
                  <sup>′</sup>
                </span>
                <span className="concept-formula-op">=</span>
                <span
                  className="concept-formula-var concept-formula-term"
                  onMouseEnter={setDesc("h_l is the original layer output before steering is applied.")}
                  onMouseLeave={resetDesc}
                >
                  h<sub>l</sub>
                </span>
                <span className="concept-formula-op">+</span>
                <span
                  className="concept-formula-var concept-formula-term"
                  onMouseEnter={setDesc(
                    "a is the steering coefficient (strength_multiple × steering_strength)."
                  )}
                  onMouseLeave={resetDesc}
                >
                  a
                </span>
                <span className="concept-formula-op">*</span>
                <span
                  className="concept-formula-var concept-formula-term"
                  onMouseEnter={setDesc(
                    "v_f is the SAE decoder vector for feature f (sae.W_dec[feature_index])."
                  )}
                  onMouseLeave={resetDesc}
                >
                  v<sub>f</sub>
                </span>
              </div>
              <p className="concept-formula-note">
                The hook replaces the layer output with a shifted activation:
                <span className="concept-inline-code">hs = hs + coefficient * steering_vector</span>. a
                is the coefficient, v<sub>f</sub> is the SAE decoder vector for feature f.
              </p>
              <div className="concept-formula-explainer">{activeDescription}</div>
            </div>

            <div className="concept-visual-card">
              <div className="concept-section-header">
                <h3>Where the hook applies</h3>
                <p>
                  We register a forward hook on one transformer layer. It adds the scaled steering
                  vector to that layer&apos;s activations.
                </p>
              </div>
              <div className="layer-chip-row" aria-label="Transformer layers with hooked layer highlighted">
                {Array.from({ length: layerCount }, (_, i) => {
                  const isHook = i === hookLayerIndex;
                  return (
                    <div key={i} className={`layer-chip ${isHook ? "layer-chip-active" : ""}`}>
                      {isHook ? (
                        <>
                          <span className="chip-segment chip-attn" title="self_attn" />
                          <span className="chip-segment chip-mlp" title="mlp" />
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div className="layer-chip-legend">
                <span className="chip-key chip-key-attn" /> self_attn &nbsp;&nbsp;
                <span className="chip-key chip-key-mlp" /> mlp &nbsp;&nbsp;
                <span className="chip-key chip-key-hook" /> hooked layer (index {hookLayerIndex}, zero-based)
              </div>
            </div>
          </div>
        </section>

        <section className="concept-section">
          <div className="concept-section-header">
            <h2>How features are found (Neuronpedia + SAEs)</h2>
            <p>
              Neuronpedia identifies "features" in LLMs by training sparse autoencoders (SAEs) on
              internal activations from a frozen model.
            </p>
          </div>
          <div className="concept-grid">
            <article className="concept-card">
              <h3>1. Collect activations</h3>
              <p>
                Run large amounts of text through the LLM. At a chosen layer or sublayer, record
                the activation vector for each token. The base model is not changed.
              </p>
            </article>
            <article className="concept-card">
              <h3>2. Train a sparse autoencoder</h3>
              <p>
                The encoder maps activation vectors to a larger set of latent feature activations,
                and the decoder maps those latents back to the original activation space. Training
                optimizes reconstruction loss.
              </p>
            </article>
            <article className="concept-card">
              <h3>3. Enforce sparsity</h3>
              <p>
                Add an L1 penalty so only a few latents fire per token. This encourages
                disentangled, interpretable features instead of superposition.
              </p>
            </article>
          </div>
          <div className="concept-callout">
            <h3>Why this reveals features</h3>
            <p>
              With sparsity, each latent behaves like a dictionary entry. Interpret it by finding
              text snippets that maximize the latent, then optionally steer the model by increasing
              or decreasing that latent.
            </p>
          </div>
        </section>

        <section className="concept-section">
          <div className="concept-section-header">
            <h2>Steering procedure used in this viewer</h2>
            <p>
              For each feature being steered, we compute a coefficient, pull the decoder vector,
              and add a scaled version of that vector to the activations.
            </p>
          </div>
          <ol className="concept-steps">
            <li>
              <strong>Compute the coefficient.</strong> Multiply steering strength by the strength
              multiple.
            </li>
            <li>
              <strong>Get the steering vector.</strong> Use the SAE decoder weights:
              <span className="concept-inline-code">sae.W_dec[feature_index]</span>.
            </li>
            <li>
              <strong>Apply the update.</strong> Add
              <span className="concept-inline-code">coefficient * steering_vector</span> to the
              activations.
            </li>
          </ol>
          <div className="concept-note">
            <h3>Why we do not scale by top activation (yet)</h3>
            <p>
              A common variant multiplies by the top known activation value, and that is valid. We
              do not do it here because:
            </p>
            <ul>
              <li>
                We may be missing activations for very sparse features (or have too few test prompts),
                but we still want those features to be steerable.
              </li>
              <li>
                We want results to be consistent across dashboards, even if different runs have
                different recorded top activations.
              </li>
            </ul>
            <p>We may add the top-activation scaling option in the future.</p>
          </div>
        </section>

        <section className="concept-section">
          <div className="concept-section-header">
            <h2>Interpretation and usage flow</h2>
            <p>
              Sparse features become interpretable handles. You can locate contexts where a latent
              fires, understand the shared concept, and then steer with that feature.
            </p>
          </div>
          <div className="concept-flow">
            <div className="concept-flow-item">Frozen LLM activations</div>
            <div className="concept-flow-arrow">-&gt;</div>
            <div className="concept-flow-item">SAE encoder</div>
            <div className="concept-flow-arrow">-&gt;</div>
            <div className="concept-flow-item">Sparse features</div>
            <div className="concept-flow-arrow">-&gt;</div>
            <div className="concept-flow-item">Interpret and steer</div>
          </div>
          <div className="concept-panel">
            <h3>Gemma Scope</h3>
            <p>
              In Gemma Scope, Google trained SAEs across every layer and sublayer output of the
              Gemma models, producing hundreds of SAEs and millions of learned latents, then hosted
              them for exploration in Neuronpedia.
            </p>
          </div>
        </section>

        <section className="concept-section concept-cta">
          <h2>Explore a real steering run</h2>
          <p>
            Use the viewer to inspect how different coefficients change output probabilities and
            compare steering results to prompt-only baselines.
          </p>
          <Link href="/viewer" className="btn btn-primary btn-large">
            Open Viewer
          </Link>
        </section>
      </div>
    </div>
  );
}
