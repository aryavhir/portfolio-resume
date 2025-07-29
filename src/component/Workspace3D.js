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


// Animated Coffee Steam Component
const CoffeeSteam = ({ position }) => {
  const steamRef = useRef();

  useFrame((state) => {
    if (steamRef.current) {
      steamRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      steamRef.current.material.opacity =
        0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <Sphere
      ref={steamRef}
      position={[position[0], position[1] + 0.3, position[2]]}
      args={[0.05]}
    >
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
    </Sphere>
  );
};

// Animated Screen Glow Component
const ScreenGlow = ({ position }) => {
  const glowRef = useRef();

  useFrame((state) => {
    if (glowRef.current) {
      const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      glowRef.current.material.emissiveIntensity = intensity;
    }
  });

  return (
    <Plane
      ref={glowRef}
      position={position}
      args={[1.18, 0.78]}
      rotation={[0, 0, 0]}
    >
      <meshStandardMaterial
        color="#0066cc"
        emissive="#0066cc"
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
    </Plane>
  );
};

// Spinning Fan Component
const SpinningFan = ({ position }) => {
  const fanRef = useRef();

  useFrame((state) => {
    if (fanRef.current) {
      fanRef.current.rotation.z = state.clock.elapsedTime * 8;
    }
  });

  return (
    <group position={position}>
      {/* Fan blades */}
      <group ref={fanRef}>
        <Box position={[0, 0, 0]} args={[0.3, 0.02, 0.02]}>
          <meshStandardMaterial color="#666" />
        </Box>
        <Box
          position={[0, 0, 0]}
          args={[0.02, 0.3, 0.02]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial color="#666" />
        </Box>
        <Box
          position={[0, 0, 0]}
          args={[0.2, 0.02, 0.02]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <meshStandardMaterial color="#666" />
        </Box>
        <Box
          position={[0, 0, 0]}
          args={[0.2, 0.02, 0.02]}
          rotation={[0, 0, -Math.PI / 4]}
        >
          <meshStandardMaterial color="#666" />
        </Box>
      </group>

      {/* Fan center */}
      <Cylinder position={[0, 0, 0]} args={[0.05, 0.05, 0.03]}>
        <meshStandardMaterial color="#333" />
      </Cylinder>
    </group>
  );
};

// Desk Component
const Desk = () => {
  return (
    <group>
      {/* Desk surface */}
      <Box
        position={[0, -0.5, 0]}
        args={[4, 0.1, 2.5]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Desk legs */}
      {[
        [-1.8, -1.2, 1],
        [1.8, -1.2, 1],
        [-1.8, -1.2, -1],
        [1.8, -1.2, -1],
      ].map((pos, index) => (
        <Box key={index} position={pos} args={[0.1, 1.4, 0.1]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
      ))}
    </group>
  );
};

// Monitor Component with Screen Glow
const Monitor = () => {
  return (
    <group position={[0, 0, -0.8]}>
      {/* Monitor base */}
      <Cylinder position={[0, -0.35, 0]} args={[0.15, 0.15, 0.1]} castShadow>
        <meshStandardMaterial color="#333" />
      </Cylinder>

      {/* Monitor stand */}
      <Box position={[0, -0.15, 0]} args={[0.05, 0.3, 0.05]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>

      {/* Monitor screen */}
      <Box position={[0, 0.2, 0]} args={[1.2, 0.8, 0.1]} castShadow>
        <meshStandardMaterial color="#000" />
      </Box>

      {/* Screen glow effect */}
      <ScreenGlow position={[0, 0.2, 0.06]} />
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

      {/* Laptop screen glow */}
      <Plane position={[0, 0.4, -0.32]} args={[1.1, 0.7]}>
        <meshStandardMaterial
          color="#0066cc"
          emissive="#0066cc"
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </Plane>

      {/* Laptop keyboard */}
      <Plane
        position={[0, 0.06, 0.1]}
        args={[1, 0.6]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#222" />
      </Plane>
    </group>
  );
};

// Coffee Cup Component with Steam
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

      {/* Steam particles */}
      <CoffeeSteam position={[0, 0.25, 0]} />
      <CoffeeSteam position={[0.05, 0.25, 0.05]} />
      <CoffeeSteam position={[-0.05, 0.25, -0.05]} />
    </group>
  );
};

// Keyboard Component
const Keyboard = () => {
  return (
    <group position={[0.5, -0.4, 0.8]}>
      {/* Keyboard base */}
      <Box position={[0, 0.03, 0]} args={[1.5, 0.06, 0.5]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>

      {/* Keys */}
      {Array.from({ length: 10 }, (_, i) => (
        <Box
          key={i}
          position={[-0.6 + i * 0.15, 0.065, 0]}
          args={[0.12, 0.02, 0.12]}
          castShadow
        >
          <meshStandardMaterial color="#666" />
        </Box>
      ))}
    </group>
  );
};

// Mouse Component
const Mouse = () => {
  return (
    <group position={[0.5, -0.4, 0.3]}>
      <Box position={[0, 0.03, 0]} args={[0.12, 0.06, 0.18]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
    </group>
  );
};

// Books Component
const Books = () => {
  return (
    <group position={[1.8, -0.35, -0.8]}>
      {/* Book 1 */}
      <Box position={[0, 0.1, 0]} args={[0.3, 0.2, 0.05]} castShadow>
        <meshStandardMaterial color="#8B0000" />
      </Box>

      {/* Book 2 */}
      <Box position={[0, 0.1, 0.06]} args={[0.3, 0.2, 0.05]} castShadow>
        <meshStandardMaterial color="#0066cc" />
      </Box>

      {/* Book 3 */}
      <Box position={[0, 0.1, 0.12]} args={[0.3, 0.2, 0.05]} castShadow>
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

// Floating Code Particles
const FloatingParticle = ({ position, color, symbol }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Text
        fontSize={0.1}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        {symbol}
      </Text>
    </group>
  );
};

// CPU Tower with Spinning Fan
const CPUTower = () => {
  return (
    <group position={[-1.8, -0.8, 0.5]}>
      {/* Main tower */}
      <Box position={[0, 0.4, 0]} args={[0.3, 0.8, 0.4]} castShadow>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>

      {/* Front panel */}
      <Box position={[0.16, 0.4, 0]} args={[0.02, 0.75, 0.35]} castShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>

      {/* Power button */}
      <Cylinder position={[0.17, 0.6, 0]} args={[0.03, 0.03, 0.01]} castShadow>
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.5}
        />
      </Cylinder>

      {/* Spinning fan */}
      <SpinningFan position={[0.17, 0.2, 0]} />
    </group>
  );
};

// Main Scene Component
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
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[0, 2, 0]} intensity={0.5} />
      <pointLight position={[-2, 1, 2]} intensity={0.3} color="#ff6b6b" />
      <pointLight position={[2, 1, 2]} intensity={0.3} color="#4ecdc4" />

      {/* Floor */}
      <Plane
        position={[0, -2, 0]}
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      {/* Workspace components */}
      <Desk />
      <Monitor />
      <Laptop />
      <CoffeeCup />
      <Keyboard />
      <Mouse />
      <Books />
      <Plant />
      <CPUTower />

      {/* Floating code particles */}
      <FloatingParticle position={[2, 1, 1]} color="#AA367C" symbol="{}" />
      <FloatingParticle position={[-2, 1.5, 1]} color="#4A2FBD" symbol="</>" />
      <FloatingParticle position={[1, 2, -1]} color="#7ee787" symbol="()" />
      <FloatingParticle position={[-1, 1.8, -1]} color="#ffa657" symbol="[]" />
      <FloatingParticle position={[0, 2.5, 0]} color="#79c0ff" symbol=";" />
      <FloatingParticle
        position={[2.5, 1.2, -0.5]}
        color="#f85149"
        symbol="<>"
      />

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        autoRotate={false}
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
      <div>Loading 3D Workspace...</div>
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
        camera={{ position: [6, 4, 6], fov: 50 }}
        style={{ height: "600px", borderRadius: "20px" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="workspace-controls-info">
        <p>
          <strong>Interactive Controls:</strong> Drag to rotate • Scroll
          to zoom • Right-click to pan
        </p>
        <p>
          <strong>Features:</strong> Animated screen glows • Spinning
          CPU fan • Coffee steam • Floating code symbols
        </p>
      </div>
    </div>
  );
};
