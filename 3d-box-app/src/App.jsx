import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
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

function Floor() {
  return (
    <mesh position={[0, -2.5, 0]} receiveShadow>
      <boxGeometry args={[16, 0.5, 16]} />
      <meshStandardMaterial
        color="#1a0033"
        emissive="#1a0033"
        emissiveIntensity={0.2}
        metalness={0.8}
        roughness={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

function Tree({ position, color = '#ff00ff' }) {
  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
        <meshStandardMaterial
          color="#4a148c"
          emissive="#4a148c"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Tree foliage - 3 cones stacked */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[1, 1.5, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.8, 1.2, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.6, 1, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  )
}

function Boxes() {
  return (
    <>
      {/* First Box */}
      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#ff1493"
          emissive="#ff1493"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <lineSegments position={[-1.5, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 2, 2)]} />
        <lineBasicMaterial color="#00ffff" linewidth={2} />
      </lineSegments>
      <Text
        position={[-1.5, 0, 1.01]}
        fontSize={0.5}
        color="#ffff00"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#ff00ff"
      >
        DigitAI Geeks
        <meshStandardMaterial
          color="#ffff00"
          emissive="#ffff00"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </Text>

      {/* Second Box */}
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <lineSegments position={[1.5, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 2, 2)]} />
        <lineBasicMaterial color="#ff00ff" linewidth={2} />
      </lineSegments>
    </>
  )
}

function Scene() {
  const groupRef = useRef()
  const isDragging = useRef(false)
  const previousMouse = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handlePointerDown = (event) => {
      isDragging.current = true
      previousMouse.current = { x: event.clientX, y: event.clientY }
    }

    const handlePointerUp = () => {
      isDragging.current = false
    }

    const handlePointerMove = (event) => {
      if (!isDragging.current) return

      const deltaX = event.clientX - previousMouse.current.x
      const deltaY = event.clientY - previousMouse.current.y

      // Update target rotation based on mouse delta
      targetRotation.current.y += deltaX * 0.01
      targetRotation.current.x += deltaY * 0.01

      previousMouse.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  // Apply smooth rotation with interpolation
  useFrame(() => {
    if (groupRef.current) {
      // Smooth interpolation (lerp) for smoother rotation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.15
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.15

      groupRef.current.rotation.x = currentRotation.current.x
      groupRef.current.rotation.y = currentRotation.current.y
    }
  })

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <Floor />

      {/* Grid on top of floor */}
      <gridHelper args={[16, 16, '#ff00ff', '#00ffff']} position={[0, -2.24, 0]} />

      {/* Trees */}
      <Tree position={[-4, -0.75, -3]} color="#ff00ff" />
      <Tree position={[5, -0.75, -2]} color="#00ffff" />
      <Tree position={[-3, -0.75, 2]} color="#ff1493" />
      <Tree position={[4, -0.75, 1]} color="#ff00ff" />
      <Tree position={[-6, -0.75, -1]} color="#00ffff" />
      <Tree position={[3, -0.75, -4]} color="#ff1493" />
      <Tree position={[-2, -0.75, -5]} color="#ff00ff" />
      <Tree position={[6, -0.75, -4]} color="#00ffff" />

      {/* Boxes */}
      <Boxes />
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
        <Scene />
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
