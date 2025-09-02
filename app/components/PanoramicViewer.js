'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function PanoramicViewer({ imageSrc, onImageCaptured }) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const [isViewerReady, setIsViewerReady] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)

  // Initialize panoramic viewer
  useEffect(() => {
    if (!containerRef.current || !imageSrc) return

    setIsViewerReady(false)

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(0, 0, 0.1)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(container.clientWidth, container.clientHeight)
    // Use modern Three.js color space API
    if ('outputColorSpace' in renderer) {
      renderer.outputColorSpace = THREE.SRGBColorSpace
    }
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    const textureLoader = new THREE.TextureLoader()
    textureLoader.setCrossOrigin('')
    textureLoader.load(
      imageSrc,
      (texture) => {
        if ('colorSpace' in texture) {
          texture.colorSpace = THREE.SRGBColorSpace
        }
        const material = new THREE.MeshBasicMaterial({ map: texture })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        viewerRef.current = { renderer, scene, camera }
        setIsViewerReady(true)
      },
      undefined,
      (err) => {
        console.error('Texture load error', err)
      }
    )

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = true
    controls.enablePan = false
    controls.rotateSpeed = -0.3

    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    let rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      setIsViewerReady(false)
    }
  }, [imageSrc])

  // Camera capture functionality
  const openCamera = async () => {
    try {
      setIsCapturing(true)
      
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera is not available on this device')
        setIsCapturing(false)
        return
      }

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })

      // Create video element
      const video = document.createElement('video')
      video.srcObject = stream
      video.autoplay = true
      video.style.position = 'fixed'
      video.style.top = '0'
      video.style.left = '0'
      video.style.width = '100%'
      video.style.height = '100%'
      video.style.zIndex = '9999'
      video.style.backgroundColor = 'black'

      // Create capture button
      const captureBtn = document.createElement('button')
      captureBtn.textContent = '📸 Capture'
      captureBtn.style.position = 'fixed'
      captureBtn.style.bottom = '20px'
      captureBtn.style.left = '50%'
      captureBtn.style.transform = 'translateX(-50%)'
      captureBtn.style.zIndex = '10000'
      captureBtn.style.padding = '12px 24px'
      captureBtn.style.backgroundColor = '#3B82F6'
      captureBtn.style.color = 'white'
      captureBtn.style.border = 'none'
      captureBtn.style.borderRadius = '8px'
      captureBtn.style.fontSize = '16px'
      captureBtn.style.fontWeight = 'bold'
      captureBtn.style.cursor = 'pointer'

      // Create cancel button
      const cancelBtn = document.createElement('button')
      cancelBtn.textContent = '❌ Cancel'
      cancelBtn.style.position = 'fixed'
      cancelBtn.style.top = '20px'
      cancelBtn.style.right = '20px'
      cancelBtn.style.zIndex = '10000'
      cancelBtn.style.padding = '8px 16px'
      cancelBtn.style.backgroundColor = '#EF4444'
      cancelBtn.style.color = 'white'
      cancelBtn.style.border = 'none'
      cancelBtn.style.borderRadius = '6px'
      cancelBtn.style.fontSize = '14px'
      cancelBtn.style.cursor = 'pointer'

      // Add elements to body
      document.body.appendChild(video)
      document.body.appendChild(captureBtn)
      document.body.appendChild(cancelBtn)

      // Capture image
      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageData)
        onImageCaptured(imageData)
        
        // Clean up
        stream.getTracks().forEach(track => track.stop())
        document.body.removeChild(video)
        document.body.removeChild(captureBtn)
        document.body.removeChild(cancelBtn)
        setIsCapturing(false)
      }

      // Cancel capture
      cancelBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop())
        document.body.removeChild(video)
        document.body.removeChild(captureBtn)
        document.body.removeChild(cancelBtn)
        setIsCapturing(false)
      }

    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
      setIsCapturing(false)
    }
  }

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setCapturedImage(imageData)
        onImageCaptured(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full">
      {/* Camera Controls */}
      <div className="mb-4 space-y-3">
        {/* Camera Symbol - Click to Open Camera */}
        <button
          onClick={openCamera}
          disabled={isCapturing}
          className="w-full flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.07-.894l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.93 1.486l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-1">{isCapturing ? 'Opening Camera...' : 'Click to open camera'}</p>
          <p className="text-sm text-gray-500">Capture panoramic image</p>
        </button>

        {/* Upload Option */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="panorama-upload"
          />
          <label
            htmlFor="panorama-upload"
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload Panorama</span>
          </label>
        </div>
      </div>

      {/* Panoramic Viewer */}
      {imageSrc && (
        <div className="w-full">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-700">Panoramic View</h3>
            <p className="text-xs text-gray-500">Drag to rotate, scroll to zoom</p>
          </div>
          <div 
            ref={containerRef}
            className="w-full h-96 sm:h-[500px] bg-gray-100 rounded-lg overflow-hidden border border-gray-300"
            style={{ minHeight: '400px' }}
          >
            {!isViewerReady && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading panorama...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!imageSrc && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">Capture or upload a panoramic image</p>
          <p className="text-sm text-gray-500">Click the camera icon to capture a 360° view or upload an existing panorama</p>
        </div>
      )}
    </div>
  )
}
