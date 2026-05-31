# Video Player Preview

## Overview
The `VideoPlayerPreview` component provides an interactive review layer before content is posted to social platforms. It replaces the static file name display with a fully functional HTML5 video player, ensuring users can verify their content, format, and metadata directly within the upload workflow.

## Key Features
- **Native Playback:** Full play, pause, and seek controls using the browser's native HTML5 `<video>` element, ensuring zero external dependencies and lightweight performance.
- **Thumbnail Generation:** Utilizes the HTML5 `<canvas>` API to seamlessly capture the active video frame and present it as a thumbnail preview.
- **Format Validation Check:** Automatically detects and displays video duration and orientation format ('Short-Form' vs 'Long-Form'). Surrounds short-form videos exceeding the recommended 90s duration with a subtle warning badge.
- **Graceful Degradation:** Fails securely on corrupt files and falls back gracefully to a non-preview state if the video is staged remotely from the gallery.

## Architecture
- `useVideoPlayer.ts`: Custom hook managing the `createObjectURL` lifecycle and the canvas extraction logic. Ensures memory leaks are prevented via proper object URL revocation.
- `VideoPlayerPreview.tsx`: The primary orchestrator component linking the context to the view layer.
- `VideoPlayerView.tsx`: The dumb presentational component for rendering the video element and the hidden canvas.

## Integration
Integrated within the `UploadForm` component stack (`VideoSelection.tsx`). It relies on `useDraftFile` to supply the active video `File` object (or Blob) for local rendering.
