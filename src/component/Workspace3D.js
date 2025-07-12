
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Plane, Text, Html } from '@react-three/drei';
import { Container, Row, Col } from 'react-bootstrap';

// Desk Component
const Desk = () => {
  return (
    <group>
      {/* Desk surface */}
      <Box position={[0, -0.5, 0]} args={[4, 0.1, 2.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Desk legs */}
      <Box position={[-1.8, -1.2, 1]} args={[0.1, 1.4, 0.1]} castShadow>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box position={[1.8, -1.2, 1]} args={[0.1, 1.4, 0.1]} castShadow>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box position={[-1.8, -1.2, -1]} args={[0.1, 1.4, 0.1]} castShadow>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box position={[1.8, -1.2, -1]} args={[0.1, 1.4, 0.1]} castShadow>
        <meshStandardMaterial color="#654321" />
      </Box>
    </group>
  );
};

// Monitor Component
const Monitor = () => {
  return (
    <group position={[0, 0.2, -0.5]}>
      {/* Monitor stand */}
      <Box position={[0, -0.3, 0]} args={[0.3, 0.6, 0.3]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
      
      {/* Monitor base */}
      <Cylinder position={[0, -0.6, 0]} args={[0.4, 0.4, 0.1]} castShadow>
        <meshStandardMaterial color="#222" />
      </Cylinder>
      
      {/* Monitor screen */}
      <Box position={[0, 0.3, 0]} args={[2.2, 1.3, 0.1]} castShadow>
        <meshStandardMaterial color="#111" />
      </Box>
      
      {/* Screen display */}
      <Plane position={[0, 0.3, 0.06]} args={[2, 1.1]}>
        <meshStandardMaterial color="#000080" emissive="#000040" />
      </Plane>
      
      {/* Code lines simulation */}
      <Plane position={[-0.5, 0.5, 0.07]} args={[0.8, 0.05]}>
        <meshStandardMaterial color="#00ff00" emissive="#004400" />
      </Plane>
      <Plane position={[-0.3, 0.3, 0.07]} args={[1.2, 0.05]}>
        <meshStandardMaterial color="#ffffff" emissive="#444444" />
      </Plane>
      <Plane position={[-0.7, 0.1, 0.07]} args={[0.6, 0.05]}>
        <meshStandardMaterial color="#ffff00" emissive="#444400" />
      </Plane>
    </group>
  );
};

// Laptop Component
const Laptop = () => {
  return (
    <group position={[1.5, -0.35, 0.5]}>
      {/* Laptop base */}
      <Box position={[0, 0, 0]} args={[1.2, 0.1, 0.8]} castShadow>
        <meshStandardMaterial color="#c0c0c0" />
      </Box>
      
      {/* Laptop screen */}
      <Box position={[0, 0.4, -0.35]} args={[1.2, 0.8, 0.05]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
      
      {/* Laptop keyboard */}
      <Plane position={[0, 0.06, 0.1]} args={[1, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#222" />
      </Plane>
    </group>
  );
};

// Coffee Cup Component
const CoffeeCup = () => {
  return (
    <group position={[-1.5, -0.35, 0.5]}>
      {/* Cup */}
      <Cylinder position={[0, 0.15, 0]} args={[0.15, 0.12, 0.25]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      
      {/* Coffee */}
      <Cylinder position={[0, 0.22, 0]} args={[0.14, 0.14, 0.05]} castShadow>
        <meshStandardMaterial color="#4A2C2A" />
      </Cylinder>
      
      {/* Handle */}
      <Cylinder position={[0.2, 0.15, 0]} args={[0.02, 0.02, 0.15]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
    </group>
  );
};

// Books Component
const Books = () => {
  return (
    <group position={[0.8, -0.35, -1]}>
      <Box position={[0, 0.05, 0]} args={[0.8, 0.1, 0.15]} castShadow>
        <meshStandardMaterial color="#8B0000" />
      </Box>
      <Box position={[0, 0.16, 0]} args={[0.75, 0.1, 0.15]} castShadow>
        <meshStandardMaterial color="#0000CD" />
      </Box>
      <Box position={[0, 0.27, 0]} args={[0.7, 0.1, 0.15]} castShadow>
        <meshStandardMaterial color="#228B22" />
      </Box>
    </group>
  );
};

// Plant Component
const Plant = () => {
  return (
    <group position={[-1.8, -0.35, -0.8]}>
      {/* Pot */}
      <Cylinder position={[0, 0.1, 0]} args={[0.15, 0.12, 0.2]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      
      {/* Soil */}
      <Cylinder position={[0, 0.18, 0]} args={[0.14, 0.14, 0.05]} castShadow>
        <meshStandardMaterial color="#654321" />
      </Cylinder>
      
      {/* Plant stem */}
      <Cylinder position={[0, 0.35, 0]} args={[0.02, 0.02, 0.3]} castShadow>
        <meshStandardMaterial color="#228B22" />
      </Cylinder>
      
      {/* Leaves */}
      <Sphere position={[-0.1, 0.5, 0]} args={[0.08]} castShadow>
        <meshStandardMaterial color="#32CD32" />
      </Sphere>
      <Sphere position={[0.1, 0.45, 0]} args={[0.06]} castShadow>
        <meshStandardMaterial color="#32CD32" />
      </Sphere>
      <Sphere position={[0, 0.55, 0.1]} args={[0.07]} castShadow>
        <meshStandardMaterial color="#32CD32" />
      </Sphere>
    </group>
  );
};

// Mouse Component
const Mouse = () => {
  return (
    <group position={[0.5, -0.4, 0.8]}>
      <Box position={[0, 0.03, 0]} args={[0.12, 0.06, 0.18]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
    </group>
  );
};

// Animated floating particles
const FloatingParticle = ({ position, color }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  
  return (
    <Box ref={meshRef} position={position} args={[0.05, 0.05, 0.05]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </Box>
  );
};

// Main 3D Scene
const Scene = () => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 2, 0]} intensity={0.5} />
      
      {/* Floor */}
      <Plane position={[0, -2, 0]} args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>
      
      {/* Workspace components */}
      <Desk />
      <Monitor />
      <Laptop />
      <CoffeeCup />
      <Books />
      <Plant />
      <Mouse />
      
      {/* Floating particles */}
      <FloatingParticle position={[2, 1, 1]} color="#AA367C" />
      <FloatingParticle position={[-2, 1.5, 1]} color="#4A2FBD" />
      <FloatingParticle position={[1, 2, -1]} color="#7ee787" />
      <FloatingParticle position={[-1, 1.8, -1]} color="#ffa657" />
      
      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

// Loading fallback
const LoadingFallback = () => (
  <Html center>
    <div style={{ 
      color: '#fff', 
      fontSize: '18px', 
      fontFamily: 'Centra, sans-serif',
      textAlign: 'center'
    }}>
      <div>Loading 3D Workspace...</div>
      <div style={{ marginTop: '10px', fontSize: '14px', opacity: 0.7 }}>
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  </Html>
);

// Main component
export const Workspace3D = () => {
  return (
    <section className="workspace-3d" id="workspace">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="workspace-3d-bx">
              <h2>My 3D Workspace</h2>
              <p>
                Explore my digital workspace in 3D. This interactive model represents 
                my coding environment where all the magic happens!
              </p>
              
              <div className="canvas-container">
                <Canvas
                  shadows
                  camera={{ position: [4, 3, 4], fov: 60 }}
                  style={{ height: '600px', borderRadius: '20px' }}
                >
                  <Suspense fallback={<LoadingFallback />}>
                    <Scene />
                  </Suspense>
                </Canvas>
              </div>
              
              <div className="workspace-controls-info">
                <p>
                  <strong>Controls:</strong> Drag to rotate • Scroll to zoom • Right-click to pan
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
