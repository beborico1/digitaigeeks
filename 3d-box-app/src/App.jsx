import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import './App.css'

function Box() {
  const meshRef = useRef()
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
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#1a237e"
        metalness={0.2}
        roughness={0.7}
        flatShading={false}
      />
    </mesh>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-3, -3, -3]} intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#a78bfa" />
        <Box />
      </Canvas>
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: '18px',
        textAlign: 'center',
        padding: '15px 30px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        Click and drag to rotate the box
      </div>
    </div>
  )
}

export default App
