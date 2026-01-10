# Prompts Folder

Dead simple folder structure - just drop in folders and they auto-appear in the viewer.

## Structure

Each prompt is a folder with 3 files:

```
prompts/
  default/
    steering_run.json
    prompt_baseline.json
    steer_vector.json
  creative-writing/
    steering_run.json
    prompt_baseline.json
    steer_vector.json
```

That's it. No config files, no index.json, nothing.

## Adding a New Prompt

1. Create a folder (e.g., `my-experiment/`)
2. Add the 3 files
3. Done - it will auto-show in the dialog

The viewer automatically discovers all folders in this directory.
