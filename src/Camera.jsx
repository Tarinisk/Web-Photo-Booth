import React, { useEffect, useRef, useState } from 'react'

export default function Camera() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [error, setError] = useState(null)
  const [stream, setStream] = useState(null)
  const [photoDataUrl, setPhotoDataUrl] = useState(null)

  useEffect(() => {
    let activeStream = null

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        activeStream = mediaStream
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play().catch(() => {})
        }
      } catch (err) {
        setError('Unable to access the camera. Please allow camera access and try again.')
        console.error('Camera access error:', err)
      }
    }

    startCamera()

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop())
      }
      setStream(null)
    }
  }, [])

  const takePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const width = video.videoWidth
    const height = video.videoHeight
    if (!width || !height) return

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, width, height)
    const dataUrl = canvas.toDataURL('image/png')
    setPhotoDataUrl(dataUrl)
  }

  const downloadPhoto = () => {
    if (!photoDataUrl) return
    const link = document.createElement('a')
    link.href = photoDataUrl
    link.download = 'camera-capture.png'
    link.click()
  }

  return (
    <div className="camera-component">
      <div className="camera-preview">
        <video ref={videoRef} autoPlay muted playsInline className="camera-video" />
        {error && <p className="camera-error">{error}</p>}
      </div>

      <div className="camera-actions">
        <button type="button" onClick={takePhoto} disabled={!!error || !stream}>
          Capture
        </button>
        <button type="button" onClick={downloadPhoto} disabled={!photoDataUrl}>
          Download Photo
        </button>
      </div>

      {photoDataUrl && (
        <div className="camera-result">
          <h2>Captured Photo</h2>
          <img src={photoDataUrl} alt="Captured" />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
