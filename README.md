# web-video-conversion

Showcase website for converting video using ffmpeg.js and ffmpeg.wasm

## Demo

Access the website [here](https://web-video-conversion.netlify.app).

## Features

- Convert `.webm` to `.mp4` or `.mp3`
- Use different ffmpeg variants
  - ffmpeg.js
  - ffmpeg.js (with WebWorker)
  - ffmpeg.wasm
  - ffmpeg.wasm (with Multi-Threading)
- Show the time required for the conversion process
- Cache files via ServiceWorker (especially relevant for big wasm files)

## Run locally

1. `pnpm install`
2. `pnpm dev`
