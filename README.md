# Steering Viewer - Next.js

This application renders steering sweep data with interactive visualizations, showing how model steering affects token probabilities.

## Features

- **Interactive Frame Viewer**: View steering sweep results with color-coded token probabilities
- **Prompt Baseline Comparison**: Compare steering effects against prompt-based interventions
- **Real-time Plots**: Live entropy and target logprob visualizations
- **Architecture Visualization**: Visual representation of the model architecture with active layer highlighting
- **Multi-file Support**: Load multiple JSON files for steering and baseline data

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Usage

### Loading Data

1. Click "Load JSON(s)" to upload steering run data files
2. The app will automatically detect steering sweep vs baseline data
3. Files named with "baseline" or with `run_type: "prompt_baseline"` will be loaded as baselines

### Default Files

The app includes sample data files in the `public/` folder that are automatically loaded on startup:

- **steering_run.json** (548 KB) - Main steering sweep data with coefficient variations
- **prompt_baseline.json** (61 KB) - Baseline comparison showing prompt-based interventions
- **steer_vector.json** (86 KB) - The learned steering vector (reference only)

These files demonstrate a steering experiment on Gemma2 at layer 20. The app will attempt to load them automatically when you first open it.

### Data Format

The app expects JSON files with the following structure:

```json
{
  "rows": [
    {
      "coeff": 0,
      "generated_pieces": ["token1", "token2", ...],
      "delta_logprobs": [0.1, -0.2, ...],
      "next_token": { "entropy": 2.5 },
      "targets": {
        "target_phrase": { "logprob": -1.2 }
      },
      "targets_first_token": {
        "target_phrase": { "rank": 5, "p": 0.15 }
      }
    }
  ],
  "prompt": "Your prompt text",
  "layer": 20,
  "max_new_tokens": 100,
  "targets": ["target1", "target2"],
  "delta_color_scale": {
    "vmin_p5": -1.0,
    "vmax_p95": 1.0
  }
}
```

## Technology Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Canvas API** - High-performance visualizations
- **React 19** - UI components

## Project Structure

```
steering-viewer-nextjs/
├── app/
│   ├── components/
│   │   ├── FrameCanvas.tsx    # Token visualization canvas
│   │   └── PlotCanvas.tsx     # Chart rendering
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main application
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
├── public/                    # Static files (JSON data)
└── package.json
```

## Key Components

### FrameCanvas
Renders individual frames showing token-by-token probability changes with color coding:
- Red: More likely under intervention
- Blue: Less likely under intervention
- Neutral: No significant change

### PlotCanvas
Renders line charts for:
- Entropy shift across coefficients
- Target phrase log probability
- Baseline comparisons

### Main Page
Manages application state and coordinates all components with tabs for:
- **Steering sweep**: Interactive coefficient slider with live visualization
- **Prompt text**: Baseline prompt comparison
- **Concept**: Educational content about steering
- **Architecture**: Model layer visualization

## Migration from Original

This Next.js version maintains 100% feature parity with the original vanilla JS implementation while adding:

- TypeScript type safety
- React component architecture
- Better state management
- Improved developer experience
- Server-side rendering capabilities

## License

ISC
