# Data Files

This folder contains the default data files that are automatically loaded by the steering viewer.

## Files

### steering_run.json (548 KB)
Main steering sweep data showing how different steering coefficients affect model outputs.

**Structure:**
- `rows[]` - Array of sweep results, one per coefficient
- `prompt` - The input prompt used
- `layer` - Which transformer layer steering was applied to
- `max_new_tokens` - Maximum tokens generated
- `targets[]` - Target phrases being tracked
- `delta_color_scale` - Color mapping for visualization

**Auto-loaded as:** Main steering data

---

### prompt_baseline.json (61 KB)
Baseline comparison data showing how prompt-based interventions affect outputs (e.g., "act like a cat" prompt).

**Structure:**
- `rows[]` - Typically 1-2 rows (plain prompt vs system prompt)
- `run_type` - Set to "prompt_baseline"
- Same structure as steering_run.json rows

**Auto-loaded as:** Baseline comparison

---

### steer_vector.json (86 KB)
The learned steering vector used for interventions.

**Structure:**
- Contains the learned direction in activation space
- Used for applying steering to model activations

**Usage:** Reference data (not automatically loaded by viewer)

---

## Usage

Place JSON files in this `public/` folder to have them automatically loaded when the app starts:

1. **steering_run.json** - Will be fetched from `/steering_run.json`
2. **prompt_baseline.json** - Will be fetched from `/prompt_baseline.json`

You can also manually upload different files using the "Load JSON(s)" button in the app interface.

## File Format

All JSON files follow this general structure:

```json
{
  "rows": [
    {
      "coeff": 0.0,
      "generated_pieces": ["token1", "token2", ...],
      "delta_logprobs": [0.1, -0.2, ...],
      "next_token": { "entropy": 2.5 },
      "targets": {
        "phrase": { "logprob": -1.2 }
      },
      "targets_first_token": {
        "phrase": { "rank": 5, "p": 0.15 }
      }
    }
  ],
  "prompt": "Your prompt here",
  "layer": 20,
  "max_new_tokens": 100,
  "targets": ["phrase1", "phrase2"],
  "delta_color_scale": {
    "vmin_p5": -1.0,
    "vmax_p95": 1.0
  }
}
```

## Generating New Data

To generate steering sweep data:
1. Run your steering experiments with your ML framework
2. Export to JSON in the format above
3. Place in this folder or upload via the UI
