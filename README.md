# web-video-conversion

Website to convert videos using ffmpeg.js and ffmpeg.wasm

## Demo

Access the website [here](https://derstimmler.github.io/web-video-conversion/).

## Features

- Convert .mp4 files to `.mpeg` or `.mp3`
- Use different ffmpeg variants
  - ffmpeg.js
  - ffmpeg.js (with WebWorker) _(planned)_
  - ffmpeg.wasm
  - ffmpeg.wasm (Multi-Threaded)
- Show duration conversion process
- Introduce caching for WASM files _(planned)_

## Run locally

1. `pnpm install`
2. `pnpm dev`
