import { ChangeEvent, useEffect, useRef, useState } from 'react'
import './App.css'

type Stage = 'home' | 'options' | 'capture' | 'upload'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photoCanvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [frames] = useState<string[]>([
    'No Frame',
    'Red Border',
    'Blue Corners',
    'Green Tint',
    'Yellow Border',
    'Fruit Frame',
    'Animal Frame',
    'Rainbow Frame',
    'Floral Frame',
    'Sparkle Frame',
    'Polaroid Frame',
    'Soft Glow Frame'
  ])
  const [selectedFrame, setSelectedFrame] = useState<string>('No Frame')
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [countdown, setCountdown] = useState<string>('')
  const [stage, setStage] = useState<Stage>('home')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string>('')

  const applyFrame = (ctx: CanvasRenderingContext2D, frame: string, w: number, h: number) => {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '28px serif'

    if (frame === 'Red Border') {
      ctx.strokeStyle = '#ff4757'
      ctx.lineWidth = 16
      ctx.strokeRect(12, 12, w - 24, h - 24)
      ctx.strokeStyle = '#ffa502'
      ctx.lineWidth = 4
      ctx.strokeRect(24, 24, w - 48, h - 48)
    } else if (frame === 'Blue Corners') {
      ctx.strokeStyle = '#1e90ff'
      ctx.lineWidth = 18
      const size = 60
      ctx.beginPath()
      ctx.moveTo(0, size)
      ctx.lineTo(0, 0)
      ctx.lineTo(size, 0)
      ctx.moveTo(w - size, 0)
      ctx.lineTo(w, 0)
      ctx.lineTo(w, size)
      ctx.moveTo(0, h - size)
      ctx.lineTo(0, h)
      ctx.lineTo(size, h)
      ctx.moveTo(w - size, h)
      ctx.lineTo(w, h)
      ctx.lineTo(w, h - size)
      ctx.stroke()
    } else if (frame === 'Green Tint') {
      ctx.fillStyle = 'rgba(0, 200, 0, 0.18)'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.lineWidth = 8
      ctx.strokeRect(10, 10, w - 20, h - 20)
    } else if (frame === 'Yellow Border') {
      ctx.strokeStyle = '#f7b731'
      ctx.lineWidth = 14
      ctx.strokeRect(12, 12, w - 24, h - 24)
      ctx.setLineDash([12, 10])
      ctx.strokeStyle = '#f6e58d'
      ctx.lineWidth = 6
      ctx.strokeRect(24, 24, w - 48, h - 48)
      ctx.setLineDash([])
    } else if (frame === 'Fruit Frame') {
      const fruits = ['🍎', '🍌', '🍓', '🍍', '🥝', '🍇']
      ctx.font = '26px serif'
      fruits.forEach((fruit, index) => {
        const x = 20 + index * ((w - 40) / (fruits.length - 1))
        ctx.fillText(fruit, x, 38)
        ctx.fillText(fruit, x, h - 18)
      })
      ctx.strokeStyle = '#ff7f50'
      ctx.lineWidth = 10
      ctx.strokeRect(5, 5, w - 10, h - 10)
    } else if (frame === 'Animal Frame') {
      const animals = ['🐶', '🐱', '🐰', '🦊', '🐼', '🦁']
      ctx.font = '26px serif'
      animals.forEach((animal, index) => {
        const x = 20 + index * ((w - 40) / (animals.length - 1))
        ctx.fillText(animal, x, 38)
        ctx.fillText(animal, x, h - 18)
      })
      ctx.strokeStyle = '#6a5acd'
      ctx.lineWidth = 10
      ctx.strokeRect(8, 8, w - 16, h - 16)
    } else if (frame === 'Rainbow Frame') {
      const colors = ['#ff3b3f', '#ff7a00', '#ffeb3b', '#2ecc71', '#3abaff', '#9b59b6']
      const stripeWidth = Math.ceil(w / colors.length)
      colors.forEach((color, index) => {
        ctx.fillStyle = color + 'b0'
        ctx.fillRect(index * stripeWidth, 0, stripeWidth, h)
      })
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 14
      ctx.strokeRect(10, 10, w - 20, h - 20)
    } else if (frame === 'Floral Frame') {
      ctx.strokeStyle = '#ff8fb3'
      ctx.lineWidth = 14
      ctx.strokeRect(8, 8, w - 16, h - 16)
      const flowers = ['🌸', '🌼', '🌺', '🌷', '🌻']
      ctx.font = '24px serif'
      flowers.forEach((flower, index) => {
        const x = 25 + index * ((w - 50) / (flowers.length - 1))
        ctx.fillText(flower, x, 40)
        ctx.fillText(flower, x, h - 40)
      })
    } else if (frame === 'Sparkle Frame') {
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#f7d794'
      ctx.lineWidth = 10
      ctx.strokeRect(15, 15, w - 30, h - 30)
      const stars = [
        { x: 40, y: 35 },
        { x: w - 40, y: 55 },
        { x: 65, y: h - 55 },
        { x: w - 75, y: h - 45 }
      ]
      ctx.fillStyle = '#ffd32a'
      stars.forEach(({ x, y }) => {
        ctx.beginPath()
        ctx.moveTo(x, y - 8)
        ctx.lineTo(x + 5, y)
        ctx.lineTo(x, y + 8)
        ctx.lineTo(x - 5, y)
        ctx.closePath()
        ctx.fill()
      })
    } else if (frame === 'Polaroid Frame') {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 18
      ctx.strokeRect(10, 10, w - 20, h - 20)
      ctx.fillStyle = 'rgba(255,255,255,0.72)'
      ctx.fillRect(10, h - 70, w - 20, 70)
      ctx.strokeStyle = '#d1d1d1'
      ctx.lineWidth = 3
      ctx.strokeRect(10, h - 70, w - 20, 70)
      ctx.fillStyle = '#444'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Smile!', w / 2, h - 40)
    } else if (frame === 'Soft Glow Frame') {
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) / 1.2)
      gradient.addColorStop(0, 'rgba(255,255,255,0.45)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 12
      ctx.strokeRect(12, 12, w - 24, h - 24)
    }
  }

  const drawFramePreview = (ctx: CanvasRenderingContext2D, frame: string, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, w, h)
    ctx.save()
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, w, h)
    ctx.restore()

    if (frame === 'No Frame') {
      // No additional preview decoration.
    } else {
      applyFrame(ctx, frame, w, h)
    }
  }

  const drawPreview = (image?: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (stage === 'capture' && videoRef.current && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    } else if (stage === 'upload' && image) {
      const ratio = Math.min(canvas.width / image.width, canvas.height / image.height)
      const width = image.width * ratio
      const height = image.height * ratio
      ctx.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'white'
      ctx.font = '24px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Preview will appear here', canvas.width / 2, canvas.height / 2)
    }

    applyFrame(ctx, selectedFrame, canvas.width, canvas.height)
  }

  function FramePreview({ frame, selected, onSelect }: { frame: string; selected: boolean; onSelect: () => void }) {
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
      const canvas = previewCanvasRef.current
      if (!canvas) return

      canvas.width = 100
      canvas.height = 75
      canvas.style.width = '100px'
      canvas.style.height = '75px'
      const ctx = canvas.getContext('2d')
      if (ctx) drawFramePreview(ctx, frame, 100, 75)
    }, [frame])

    return (
      <div className={`frame-option ${selected ? 'selected' : ''}`} onClick={onSelect}>
        <canvas ref={previewCanvasRef} className="frame-preview"></canvas>
        <span>{frame}</span>
      </div>
    )
  }

  useEffect(() => {
    let animationId: number | null = null

    const startCaptureStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        streamRef.current = stream
        const video = document.createElement('video')
        video.autoplay = true
        video.muted = true
        video.playsInline = true
        video.srcObject = stream
        videoRef.current = video
        video.addEventListener('loadedmetadata', () => {
          const animate = () => {
            drawPreview()
            animationId = requestAnimationFrame(animate)
          }
          animate()
        })
        await video.play()
      } catch (err) {
        console.error('Error accessing camera:', err)
      }
    }

    if (stage === 'capture') {
      startCaptureStream()
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      videoRef.current = null
    }
  }, [stage, selectedFrame])

  useEffect(() => {
    if (stage === 'upload' && uploadedImage) {
      const image = new Image()
      image.src = uploadedImage
      image.onload = () => drawPreview(image)
    }
  }, [stage, uploadedImage, selectedFrame])

  const startCapture = () => {
    setStage('capture')
    setCapturedPhotos([])
    setUploadedImage(null)
    setUploadError('')
  }

  const startUpload = () => {
    setStage('upload')
    setCapturedPhotos([])
    setUploadedImage(null)
    setUploadError('')
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        setUploadedImage(result)
        setUploadError('')
      }
    }
    reader.readAsDataURL(file)
  }

  const takePhoto = () => {
    let seconds = 3
    setCountdown(`Timer: ${seconds}s`)

    const interval = setInterval(() => {
      seconds -= 1
      if (seconds > 0) {
        setCountdown(`Timer: ${seconds}s`)
      } else {
        clearInterval(interval)
        setCountdown('Cheese!')
        setTimeout(() => {
          const previewCanvas = canvasRef.current
          const photoCanvas = photoCanvasRef.current
          if (previewCanvas && photoCanvas) {
            const ctx = photoCanvas.getContext('2d')
            if (ctx) {
              ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height)
              ctx.drawImage(previewCanvas, 0, 0)
            }
          }
          setCountdown('')
        }, 500)
      }
    }, 1000)
  }

  const takeMultiplePhotos = (num: number) => {
    setCapturedPhotos([])
    let count = 0

    const captureNext = () => {
      if (count >= num) {
        setCountdown('')
        return
      }

      let seconds = 5
      setCountdown(`Timer: ${seconds}s`)
      const interval = setInterval(() => {
        seconds -= 1
        if (seconds > 0) {
          setCountdown(`Timer: ${seconds}s`)
        } else {
          clearInterval(interval)
          setCountdown('Cheese!')
          setTimeout(() => {
            const previewCanvas = canvasRef.current
            if (previewCanvas) {
              const dataURL = previewCanvas.toDataURL()
              setCapturedPhotos(prev => [...prev, dataURL])
              count += 1
              if (count < num) {
                captureNext()
              } else {
                setCountdown('')
              }
            }
          }, 500)
        }
      }, 1000)
    }

    captureNext()
  }

  const reset = () => {
    const photoCanvas = photoCanvasRef.current
    if (photoCanvas) {
      const ctx = photoCanvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height)
    }
    setCapturedPhotos([])
  }

  const download = () => {
    const photoCanvas = photoCanvasRef.current
    if (photoCanvas) {
      const link = document.createElement('a')
      link.download = 'photo.png'
      link.href = photoCanvas.toDataURL()
      link.click()
    }
  }

  const downloadStrip = () => {
    if (capturedPhotos.length === 0) return
    const numPhotos = capturedPhotos.length
    const cols = numPhotos === 2 ? 1 : 2
    const rows = Math.ceil(numPhotos / cols)
    const canvas = document.createElement('canvas')
    canvas.width = 640 * cols
    canvas.height = 480 * rows
    const ctx = canvas.getContext('2d')
    if (ctx) {
      capturedPhotos.forEach((photo, i) => {
        const img = new Image()
        img.src = photo
        img.onload = () => {
          const x = (i % cols) * 640
          const y = Math.floor(i / cols) * 480
          ctx.drawImage(img, x, y, 640, 480)
          if (i === capturedPhotos.length - 1) {
            const link = document.createElement('a')
            link.download = `photo-strip-${numPhotos}.png`
            link.href = canvas.toDataURL()
            link.click()
          }
        }
      })
    }
  }

  if (stage === 'home') {
    return (
      <div className="app home-page">
        <div className="page-card">
          <h1>Welcome to Photo Booth</h1>
          <p>Choose your photo flow and add fun frames before downloading.</p>
          <button className="start-btn" onClick={() => setStage('options')}>Start</button>
        </div>
      </div>
    )
  }

  if (stage === 'options') {
    return (
      <div className="app home-page">
        <div className="page-card">
          <h1>How would you like to add your photo?</h1>
          <div className="option-buttons">
            <button className="option-btn" onClick={startCapture}>Capture Photo</button>
            <button className="option-btn" onClick={startUpload}>Upload Photo</button>
          </div>
          <button className="back-btn" onClick={() => setStage('home')}>Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <main className="main-content">
        <header>
          <h1>🎉 Photo Booth 🎉</h1>
          <p>Select a frame, take or upload your photo, and download it!</p>
        </header>
        {stage === 'upload' && (
          <div className="upload-section">
            <label className="upload-label">
              Choose an image from your device
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            {uploadError && <p className="upload-error">{uploadError}</p>}
          </div>
        )}
        <div className="preview-container">
          <canvas ref={canvasRef} className="video" width={640} height={480}></canvas>
          {countdown && <div className="countdown">{countdown}</div>}
        </div>
        <div className="controls">
          <button onClick={takePhoto} className="take-photo-btn">📸 Take Photo</button>
          <button onClick={() => takeMultiplePhotos(2)} className="take-multiple-btn">📸 Take 2 Photos</button>
          <button onClick={() => takeMultiplePhotos(4)} className="take-multiple-btn">📸 Take 4 Photos</button>
          <button onClick={reset} className="reset-btn">🔄 Reset</button>
          <button className="back-btn" onClick={() => setStage('options')}>Change Mode</button>
        </div>
        <canvas ref={photoCanvasRef} className="canvas" width={640} height={480}></canvas>
        <button onClick={download} className="download-btn">⬇️ Download</button>
        {capturedPhotos.length > 0 && (
          <div className="photo-strip">
            {capturedPhotos.map((photo, i) => (
              <img key={i} src={photo} alt={`Photo ${i + 1}`} className="strip-photo" />
            ))}
            <button onClick={downloadStrip} className="download-strip-btn">📥 Download Strip</button>
          </div>
        )}
      </main>
      <aside className="sidebar">
        <h2>Choose a Frame</h2>
        <div className="frame-options">
          {frames.map(frame => (
            <FramePreview
              key={frame}
              frame={frame}
              selected={selectedFrame === frame}
              onSelect={() => setSelectedFrame(frame)}
            />
          ))}
        </div>
      </aside>
    </div>
  )
}

export default App
