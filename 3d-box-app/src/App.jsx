import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import './App.css'

function CameraController() {
  const { camera } = useThree()
  const zoom = useRef(6)
  const touchDistance = useRef(0)

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault()
      const delta = event.deltaY * 0.01
      zoom.current = Math.max(3, Math.min(15, zoom.current + delta))
    }

    const handleTouchStart = (event) => {
      if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX
        const dy = event.touches[0].clientY - event.touches[1].clientY
        touchDistance.current = Math.sqrt(dx * dx + dy * dy)
      }
    }

    const handleTouchMove = (event) => {
      if (event.touches.length === 2) {
        event.preventDefault()
        const dx = event.touches[0].clientX - event.touches[1].clientX
        const dy = event.touches[0].clientY - event.touches[1].clientY
        const newDistance = Math.sqrt(dx * dx + dy * dy)

        const delta = (touchDistance.current - newDistance) * 0.02
        zoom.current = Math.max(3, Math.min(15, zoom.current + delta))
        touchDistance.current = newDistance
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  useFrame(() => {
    camera.position.z += (zoom.current - camera.position.z) * 0.1
  })

  return null
}

function Grid() {
  return (
    <gridHelper args={[20, 20, '#ff00ff', '#00ffff']} position={[0, -2, 0]} />
  )
}

function Box() {
  const meshRef = useRef()
  const edgesRef = useRef()
  const [isDragging, setIsDragging] = useState(false)
  const [previousMouse, setPreviousMouse] = useState({ x: 0, y: 0 })
  const rotation = useRef({ x: 0, y: 0 })

  const handlePointerDown = (event) => {
    setIsDragging(true)
    setPreviousMouse({ x: event.clientX, y: event.clientY })
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  const handlePointerMove = (event) => {
    if (!isDragging) return

    const deltaX = event.clientX - previousMouse.x
    const deltaY = event.clientY - previousMouse.y

    // Update rotation based on mouse delta
    rotation.current.y += deltaX * 0.01
    rotation.current.x += deltaY * 0.01

    setPreviousMouse({ x: event.clientX, y: event.clientY })
  }

  // Apply rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation.current.x
      meshRef.current.rotation.y = rotation.current.y
      edgesRef.current.rotation.x = rotation.current.x
      edgesRef.current.rotation.y = rotation.current.y
    }
  })

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#ff1493"
          emissive="#ff1493"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 2, 2)]} />
        <lineBasicMaterial color="#00ffff" linewidth={2} />
      </lineSegments>
    </group>
  )
}

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d1b4e 100%)'
    }}>
      <Canvas camera={{ position: [0, 1, 6], fov: 60 }}>
        <CameraController />
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#ff00ff" />
        <pointLight position={[-5, 3, -5]} intensity={1.2} color="#00ffff" />
        <pointLight position={[0, -5, 0]} intensity={0.8} color="#ff1493" />
        <spotLight position={[0, 10, 0]} intensity={2} color="#ff00ff" angle={0.6} penumbra={1} />
        <Grid />
        <Box />
        <fog attach="fog" args={['#1a0033', 5, 20]} />
      </Canvas>
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#00ffff',
        fontSize: '18px',
        textAlign: 'center',
        padding: '15px 30px',
        background: 'rgba(255, 0, 255, 0.1)',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        border: '2px solid #ff00ff',
        boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)',
        fontWeight: 'bold',
        textShadow: '0 0 10px #00ffff'
      }}>
        Click and drag to rotate • Scroll or pinch to zoom
      </div>
    </div>
  )
}

export default App
