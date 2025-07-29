import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Box,
  Sphere,
  Cylinder,
  Plane,
  Text,
  Html,
} from "@react-three/drei";

// Animated Floating Particles
const FloatingParticle = ({ position, color, size = 0.02 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0] * 2) * 0.3;
      meshRef.current.position.x =
        position[0] + Math.sin(state.clock.elapsedTime * 0.8 + position[2]) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[size]}
    >
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
};

// Building Component
const Building = ({ position, height, color, width = 0.8, depth = 0.8 }) => {
  return (
    <group position={position}>
      {/* Main building */}
      <Box position={[0, height/2, 0]} args={[width, height, depth]} castShadow>
        <meshStandardMaterial color={color} />
      </Box>

      {/* Roof */}
      <Box position={[0, height + 0.05, 0]} args={[width + 0.1, 0.1, depth + 0.1]} castShadow>
        <meshStandardMaterial color="#444" />
      </Box>

      {/* Windows */}
      {Array.from({ length: Math.floor(height * 2) }, (_, i) => (
        <Box
          key={i}
          position={[width/2 + 0.01, 0.3 + i * 0.4, 0]}
          args={[0.02, 0.15, 0.1]}
          castShadow
        >
          <meshStandardMaterial
            color="#87CEEB"
            emissive="#87CEEB"
            emissiveIntensity={0.2}
          />
        </Box>
      ))}
    </group>
  );
};

// Cherry Blossom Tree
const CherryBlossomTree = ({ position }) => {
  const blossomRef = useRef();

  useFrame((state) => {
    if (blossomRef.current) {
      blossomRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} ref={blossomRef}>
      {/* Trunk */}
      <Cylinder position={[0, 0.4, 0]} args={[0.05, 0.05, 0.8]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>

      {/* Branches */}
      <Cylinder position={[0.2, 0.6, 0]} args={[0.02, 0.02, 0.3]} rotation={[0, 0, Math.PI/4]} castShadow>
        <meshStandardMaterial color="#654321" />
      </Cylinder>
      <Cylinder position={[-0.2, 0.6, 0]} args={[0.02, 0.02, 0.3]} rotation={[0, 0, -Math.PI/4]} castShadow>
        <meshStandardMaterial color="#654321" />
      </Cylinder>

      {/* Cherry blossoms */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 0.3 + Math.random() * 0.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Sphere
            key={i}
            position={[x, 0.7 + Math.random() * 0.3, z]}
            args={[0.04]}
            castShadow
          >
            <meshStandardMaterial color="#FFB6C1" />
          </Sphere>
        );
      })}
    </group>
  );
};

// Street Lamp
const StreetLamp = ({ position }) => {
  return (
    <group position={position}>
      {/* Pole */}
      <Cylinder position={[0, 0.6, 0]} args={[0.02, 0.02, 1.2]} castShadow>
        <meshStandardMaterial color="#333" />
      </Cylinder>

      {/* Lamp head */}
      <Sphere position={[0, 1.2, 0]} args={[0.08]} castShadow>
        <meshStandardMaterial
          color="#FFF8DC"
          emissive="#FFF8DC"
          emissiveIntensity={0.4}
        />
      </Sphere>

      {/* Base */}
      <Cylinder position={[0, 0, 0]} args={[0.08, 0.06, 0.1]} castShadow>
        <meshStandardMaterial color="#444" />
      </Cylinder>
    </group>
  );
};

// Torii Gate
const ToriiGate = ({ position }) => {
  return (
    <group position={position}>
      {/* Left pillar */}
      <Cylinder position={[-0.8, 0.8, 0]} args={[0.06, 0.06, 1.6]} castShadow>
        <meshStandardMaterial color="#8B0000" />
      </Cylinder>

      {/* Right pillar */}
      <Cylinder position={[0.8, 0.8, 0]} args={[0.06, 0.06, 1.6]} castShadow>
        <meshStandardMaterial color="#8B0000" />
      </Cylinder>

      {/* Top beam */}
      <Box position={[0, 1.5, 0]} args={[1.8, 0.08, 0.08]} castShadow>
        <meshStandardMaterial color="#8B0000" />
      </Box>

      {/* Middle beam */}
      <Box position={[0, 1.2, 0]} args={[1.4, 0.06, 0.06]} castShadow>
        <meshStandardMaterial color="#8B0000" />
      </Box>
    </group>
  );
};

// Pagoda Tower
const Pagoda = ({ position }) => {
  return (
    <group position={position}>
      {/* Base level */}
      <Box position={[0, 0.2, 0]} args={[1.2, 0.4, 1.2]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box position={[0, 0.45, 0]} args={[1.4, 0.1, 1.4]} castShadow>
        <meshStandardMaterial color="#8B0000" />
      </Box>

      {/* Second level */}
      <Box position={[0, 0.7, 0]} args={[1.0, 0.3, 1.0]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box position={[0, 0.9, 0]} args={[1.2, 0.08, 1.2]} castShadow>
        <meshStandardMaterial color="#8B0000" />
      </Box>

      {/* Third level */}
      <Box position={[0, 1.1, 0]} args={[0.8, 0.25, 0.8]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box position={[0, 1.28, 0]} args={[1.0, 0.06, 1.0]} castShadow>
        <meshStandardMaterial color="#8B0000" />
      </Box>

      {/* Top spire */}
      <Cylinder position={[0, 1.5, 0]} args={[0.02, 0.02, 0.4]} castShadow>
        <meshStandardMaterial color="#FFD700" />
      </Cylinder>
      <Sphere position={[0, 1.72, 0]} args={[0.04]} castShadow>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>
    </group>
  );
};

// Stone Lantern
const StoneLantern = ({ position }) => {
  return (
    <group position={position}>
      {/* Base */}
      <Box position={[0, 0.1, 0]} args={[0.3, 0.2, 0.3]} castShadow>
        <meshStandardMaterial color="#696969" />
      </Box>

      {/* Middle section */}
      <Cylinder position={[0, 0.35, 0]} args={[0.08, 0.08, 0.3]} castShadow>
        <meshStandardMaterial color="#696969" />
      </Cylinder>

      {/* Lantern body */}
      <Box position={[0, 0.6, 0]} args={[0.25, 0.2, 0.25]} castShadow>
        <meshStandardMaterial color="#696969" />
      </Box>

      {/* Light */}
      <Box position={[0, 0.6, 0.13]} args={[0.15, 0.1, 0.02]} castShadow>
        <meshStandardMaterial
          color="#FFF8DC"
          emissive="#FFF8DC"
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Top */}
      <Box position={[0, 0.75, 0]} args={[0.3, 0.08, 0.3]} castShadow>
        <meshStandardMaterial color="#696969" />
      </Box>
    </group>
  );
};

// Main Scene Component
const Scene = () => {
  return (
    <>
      {/* Lighting setup for atmospheric feel */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Warm atmospheric lights */}
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#FFA500" />
      <pointLight position={[-3, 2, 3]} intensity={0.3} color="#FF69B4" />
      <pointLight position={[3, 2, -3]} intensity={0.3} color="#87CEEB" />

      {/* Ground plane with texture-like appearance */}
      <Plane
        position={[0, -0.1, 0]}
        args={[25, 25]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#2F4F2F" />
      </Plane>

      {/* Streets */}
      <Plane
        position={[0, -0.05, 0]}
        args={[20, 1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#696969" />
      </Plane>
      <Plane
        position={[0, -0.05, 0]}
        args={[1.5, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#696969" />
      </Plane>

      {/* Buildings arranged in a city-like pattern */}
      <Building position={[-2, 0, -3]} height={1.5} color="#4A4A4A" />
      <Building position={[2, 0, -3]} height={2.2} color="#5A5A5A" />
      <Building position={[-4, 0, -2]} height={1.8} color="#3A3A3A" />
      <Building position={[4, 0, -2]} height={1.3} color="#6A6A6A" />
      <Building position={[-3, 0, 2]} height={2.0} color="#4A4A4A" />
      <Building position={[3, 0, 2]} height={1.6} color="#5A5A5A" />
      <Building position={[-1.5, 0, 4]} height={1.4} color="#3A3A3A" />
      <Building position={[1.5, 0, 4]} height={1.9} color="#6A6A6A" />

      {/* Cherry blossom trees */}
      <CherryBlossomTree position={[-1.2, 0, -1.2]} />
      <CherryBlossomTree position={[1.2, 0, 1.2]} />
      <CherryBlossomTree position={[-3.5, 0, 1]} />

      {/* Street lamps */}
      <StreetLamp position={[-0.8, 0, -0.8]} />
      <StreetLamp position={[0.8, 0, 0.8]} />
      <StreetLamp position={[-0.8, 0, 2.5]} />
      <StreetLamp position={[0.8, 0, -2.5]} />

      {/* Traditional elements */}
      <ToriiGate position={[0, 0, -5]} />
      <Pagoda position={[-6, 0, 0]} />
      <StoneLantern position={[2.5, 0, -1]} />
      <StoneLantern position={[-2.5, 0, 1]} />
      <StoneLantern position={[1, 0, -4]} />

      {/* Floating magical particles */}
      <FloatingParticle position={[2, 1.5, 1]} color="#FFB6C1" size={0.03} />
      <FloatingParticle position={[-2, 2, -1]} color="#87CEEB" size={0.025} />
      <FloatingParticle position={[1, 2.5, -2]} color="#FFA500" size={0.02} />
      <FloatingParticle position={[-1, 1.8, 2]} color="#98FB98" size={0.03} />
      <FloatingParticle position={[3, 1.2, -3]} color="#DDA0DD" size={0.025} />
      <FloatingParticle position={[-3, 2.2, 1.5]} color="#F0E68C" size={0.02} />
      <FloatingParticle position={[0.5, 3, 0.5]} color="#FFB6C1" size={0.03} />
      <FloatingParticle position={[-0.5, 2.8, -0.5]} color="#87CEEB" size={0.025} />

      {/* Code symbols floating in the scene */}
      <Text
        position={[4, 3, 2]}
        fontSize={0.2}
        color="#AA367C"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        {"{}"}
      </Text>
      <Text
        position={[-4, 2.5, -2]}
        fontSize={0.15}
        color="#7ee787"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        {"</>"} 
      </Text>

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 8}
        autoRotate={true}
        autoRotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
};

// Loading fallback
const LoadingFallback = () => (
  <Html center>
    <div
      style={{
        color: "#fff",
        fontSize: "18px",
        fontFamily: "Centra, sans-serif",
        textAlign: "center",
        background: "rgba(0,0,0,0.7)",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <div>Loading Little Tokyo Scene...</div>
      <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.7 }}>
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  </Html>
);

// Main component
export const Workspace3D = () => {
  return (
    <div className="canvas-container" style={{ marginTop: '20px' }}>
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 60 }}
        style={{ height: "700px", borderRadius: "20px" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="workspace-controls-info">
        <p>
          <strong>Interactive Controls:</strong> Drag to rotate • Scroll
          to zoom • Right-click to pan • Auto-rotate enabled
        </p>
        <p>
          <strong>Features:</strong> Mini Tokyo cityscape • Cherry blossoms • Traditional architecture • Floating particles • Dynamic lighting
        </p>
      </div>
    </div>
  );
};