import { ChangeEvent, useEffect, useRef, useState } from 'react'
import './App.css'

type Stage = 'home' | 'options' | 'capture' | 'upload'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photoCanvasRef = useRef<HTMLCanvasElement>(null)
  const framePreviews = useRef<{ [key: string]: HTMLCanvasElement | null }>({})
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
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 10
      ctx.strokeRect(5, 5, w - 10, h - 10)
    } else if (frame === 'Blue Corners') {
      ctx.fillStyle = 'blue'
      ctx.fillRect(0, 0, 50, 50)
      ctx.fillRect(w - 50, 0, 50, 50)
      ctx.fillRect(0, h - 50, 50, 50)
      ctx.fillRect(w - 50, h - 50, 50, 50)
    } else if (frame === 'Green Tint') {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)'
      ctx.fillRect(0, 0, w, h)
    } else if (frame === 'Yellow Border') {
      ctx.strokeStyle = 'yellow'
      ctx.lineWidth = 15
      ctx.strokeRect(0, 0, w, h)
    } else if (frame === 'Fruit Frame') {
      ctx.strokeStyle = '#ff7f50'
      ctx.lineWidth = 12
      ctx.strokeRect(0, 0, w, h)
      ctx.fillStyle = 'black'
      const fruits = ['🍎', '🍌', '🍓', '🍍', '🥝', '🍇']
      fruits.forEach((fruit, index) => {
        const x = (index + 1) * (w / (fruits.length + 1))
        ctx.fillText(fruit, x, 35)
        ctx.fillText(fruit, x, h - 35)
      })
    } else if (frame === 'Animal Frame') {
      ctx.strokeStyle = '#6a5acd'
      ctx.lineWidth = 12
      ctx.strokeRect(0, 0, w, h)
      ctx.fillStyle = 'black'
      const animals = ['🐶', '🐱', '🐰', '🦊', '🐼', '🦁']
      animals.forEach((animal, index) => {
        const x = (index + 1) * (w / (animals.length + 1))
        ctx.fillText(animal, x, 35)
        ctx.fillText(animal, x, h - 35)
      })
    } else if (frame === 'Rainbow Frame') {
      const colors = ['#ff3b3f', '#ff7a00', '#ffeb3b', '#2ecc71', '#3abaff', '#9b59b6']
      const stripeHeight = Math.ceil(h / colors.length)
      colors.forEach((color, index) => {
        ctx.fillStyle = color + '80'
        ctx.fillRect(0, index * stripeHeight, w, stripeHeight)
      })
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 10
      ctx.strokeRect(0, 0, w, h)
    } else if (frame === 'Floral Frame') {
      ctx.strokeStyle = '#ff8fb3'
      ctx.lineWidth = 12
      ctx.strokeRect(0, 0, w, h)
      const flowers = ['🌸', '🌼', '🌺', '🌷', '🌻']
      ctx.font = '20px serif'
      flowers.forEach((flower, index) => {
        const x = (index + 1) * (w / (flowers.length + 1))
        ctx.fillText(flower, x, 35)
        ctx.fillText(flower, x, h - 35)
      })
    } else if (frame === 'Sparkle Frame') {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 8
      ctx.strokeRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      const stars = [
        { x: 40, y: 40 },
        { x: w - 40, y: 60 },
        { x: 60, y: h - 60 },
        { x: w - 70, y: h - 50 }
      ]
      stars.forEach(({ x, y }) => {
        ctx.beginPath()
        ctx.moveTo(x, y - 10)
        ctx.lineTo(x + 6, y)
        ctx.lineTo(x, y + 10)
        ctx.lineTo(x - 6, y)
        ctx.closePath()
        ctx.fill()
      })
    } else if (frame === 'Polaroid Frame') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#f2f2f2'
      ctx.fillRect(15, 15, w - 30, h - 65)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(15, h - 50, w - 30, 35)
      ctx.strokeStyle = '#ccc'
      ctx.lineWidth = 3
      ctx.strokeRect(0, 0, w, h)
      ctx.fillStyle = '#999'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Smile!', w / 2, h - 30)
    } else if (frame === 'Soft Glow Frame') {
      const gradient = ctx.createLinearGradient(0, 0, w, h)
      gradient.addColorStop(0, 'rgba(255, 192, 203, 0.4)')
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)')
      gradient.addColorStop(1, 'rgba(173, 216, 230, 0.4)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 8
      ctx.strokeRect(10, 10, w - 20, h - 20)
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
    frames.forEach(frame => {
      const frameCanvas = framePreviews.current[frame]
      if (frameCanvas) {
        const ctx = frameCanvas.getContext('2d')
        if (ctx) {
          drawFramePreview(ctx, frame, frameCanvas.width, frameCanvas.height)
        }
      }
    })
  }, [frames])

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
    setCountdown('3')
    setTimeout(() => setCountdown('2'), 1000)
    setTimeout(() => setCountdown('1'), 2000)
    setTimeout(() => {
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
    }, 3000)
  }

  const takeMultiplePhotos = (num: number) => {
    setCapturedPhotos([])
    let count = 0

    const take = () => {
      if (count < num) {
        setCountdown((num - count).toString())
        setTimeout(() => {
          setCountdown('Cheese!')
          setTimeout(() => {
            const previewCanvas = canvasRef.current
            if (previewCanvas) {
              const dataURL = previewCanvas.toDataURL()
              setCapturedPhotos(prev => [...prev, dataURL])
              count++
              setCountdown('')
              setTimeout(take, 1000)
            }
          }, 500)
        }, 2000)
      }
    }

    take()
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
            <div
              key={frame}
              className={`frame-option ${selectedFrame === frame ? 'selected' : ''}`}
              onClick={() => setSelectedFrame(frame)}
            >
              <canvas
                ref={el => { framePreviews.current[frame] = el }}
                width={100}
                height={75}
                className="frame-preview"
              ></canvas>
              <span>{frame}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default App
