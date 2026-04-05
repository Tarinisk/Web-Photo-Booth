# Photo Booth Web App

A simple web application that allows users to take photos using their camera, apply different frames, and download the edited images.

## Features

- Access camera for live video feed
- Take photos
- Select from different frame options
- Preview the photo with applied frame
- Download the photo as PNG

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Allow camera access when prompted.
2. Select a frame from the options.
3. Click "Take Photo" to capture the image.
4. View the preview on the canvas.
5. Click "Download" to save the image.

## Technologies Used

- React
- TypeScript
- Vite
- HTML5 Canvas API
- MediaDevices API

Note: This app requires a browser that supports getUserMedia for camera access.