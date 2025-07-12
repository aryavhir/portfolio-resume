import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Plane, Text, Html, useTexture, Stars, Cloud, Sparkles } from '@react-three/drei';
import { Container, Row, Col } from 'react-bootstrap';
import * as THREE from 'three';

// Animated Coffee Steam Component
const CoffeeSteam = ({ position }) => {
  const steamRef = useRef();

  useFrame((state) => {
    if (steamRef.current) {
      steamRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      steamRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <Sphere ref={steamRef} position={[position[0], position[1] + 0.3, position[2]]} args={[0.05]}>
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
    <Plane ref={glowRef} position={position} args={[1.18, 0.78]} rotation={[0, 0, 0]}>
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
        <Box position={[0, 0, 0]} args={[0.02, 0.3, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#666" />
        </Box>
        <Box position={[0, 0, 0]} args={[0.2, 0.02, 0.02]} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#666" />
        </Box>
        <Box position={[0, 0, 0]} args={[0.2, 0.02, 0.02]} rotation={[0, 0, -Math.PI / 4]}>
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
      <Box position={[0, -0.5, 0]} args={[4, 0.1, 2.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Desk legs */}
      {[
        [-1.8, -1.2, 1],
        [1.8, -1.2, 1],
        [-1.8, -1.2, -1],
        [1.8, -1.2, -1]
      ].map((pos, index) => (
        <Box key={index} position={pos} args={[0.1, 1.4, 0.1]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
      ))}
    </group>
  );
};

// Interactive Monitor Component
const Monitor = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [screenContent, setScreenContent] = useState(0);
  const screenRef = useRef();

  useFrame((state) => {
    if (screenRef.current && isClicked) {
      screenRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const handleClick = () => {
    setIsClicked(!isClicked);
    setScreenContent((prev) => (prev + 1) % 3);
  };

  const getScreenColor = () => {
    switch (screenContent) {
      case 0: return "#0066cc";
      case 1: return "#ff6b6b";
      case 2: return "#4ecdc4";
      default: return "#0066cc";
    }
  };

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

      {/* Interactive screen content */}
      <Plane 
        ref={screenRef}
        position={[0, 0.2, 0.06]} 
        args={[1.18, 0.78]} 
        onClick={handleClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <meshStandardMaterial 
          color={getScreenColor()}
          emissive={getScreenColor()}
          emissiveIntensity={isClicked ? 0.8 : 0.3}
          transparent
          opacity={0.8}
        />
      </Plane>

      {/* Screen reflection */}
      <Plane position={[0, 0.2, 0.055]} args={[1.18, 0.78]}>
        <meshStandardMaterial 
          color="#ffffff"
          transparent
          opacity={0.1}
          reflectivity={0.9}
        />
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
      <Plane position={[0, 0.06, 0.1]} args={[1, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
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
        <Box key={i} position={[(-0.6 + i * 0.15), 0.065, 0]} args={[0.12, 0.02, 0.12]} castShadow>
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
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
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
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </Cylinder>

      {/* Spinning fan */}
      <SpinningFan position={[0.17, 0.2, 0]} />
    </group>
  );
};

// Holographic Display Component
const HolographicDisplay = () => {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      const scale = isHovered ? 1.2 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={[0, 1.5, 0]}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Holographic frame */}
      <Box args={[0.8, 0.6, 0.02]}>
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </Box>
      
      {/* Holographic content */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.08}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >
        {isHovered ? "INTERACTIVE MODE\nENGAGED" : "PORTFOLIO\nSYSTEM ONLINE"}
      </Text>

      {/* Holographic particles */}
      <Sparkles count={20} scale={0.5} size={2} speed={0.5} color="#00ffff" />
    </group>
  );
};

// Interactive Particle System
const InteractiveParticles = () => {
  const { camera, mouse } = useThree();
  const particlesRef = useRef();

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = mouse.y * 0.1;
      particlesRef.current.rotation.y = mouse.x * 0.1;
    }
  });

  return (
    <group ref={particlesRef}>
      <Sparkles 
        count={100} 
        scale={8} 
        size={3} 
        speed={0.3} 
        color="#AA367C"
        opacity={0.6}
      />
    </group>
  );
};

// Floating Workspace Tools
const FloatingTools = () => {
  const toolsRef = useRef();

  useFrame((state) => {
    if (toolsRef.current) {
      toolsRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
        child.rotation.y = state.clock.elapsedTime * 0.5 + index;
      });
    }
  });

  const tools = [
    { position: [3, 2, 0], color: "#ff6b6b", symbol: "💻" },
    { position: [-3, 2, 0], color: "#4ecdc4", symbol: "⚙️" },
    { position: [2, 2.5, 2], color: "#ffa657", symbol: "🚀" },
    { position: [-2, 2.5, 2], color: "#7ee787", symbol: "🎨" },
  ];

  return (
    <group ref={toolsRef}>
      {tools.map((tool, index) => (
        <group key={index} position={tool.position}>
          <Sphere args={[0.15]}>
            <meshStandardMaterial 
              color={tool.color}
              emissive={tool.color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.8}
            />
          </Sphere>
          <Text
            position={[0, 0, 0.2]}
            fontSize={0.15}
            color="#fff"
            anchorX="center"
            anchorY="middle"
          >
            {tool.symbol}
          </Text>
        </group>
      ))}
    </group>
  );
};

// Enhanced Coffee Cup with Interactive Steam
const EnhancedCoffeeCup = () => {
  const [isHot, setIsHot] = useState(true);
  const cupRef = useRef();

  useFrame((state) => {
    if (cupRef.current) {
      cupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group 
      ref={cupRef}
      position={[-1.5, -0.35, 0.5]}
      onClick={() => setIsHot(!isHot)}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Cup */}
      <Cylinder position={[0, 0.15, 0]} args={[0.15, 0.12, 0.25]} castShadow>
        <meshStandardMaterial color={isHot ? "#8B4513" : "#654321"} />
      </Cylinder>

      {/* Coffee */}
      <Cylinder position={[0, 0.22, 0]} args={[0.14, 0.14, 0.05]} castShadow>
        <meshStandardMaterial color={isHot ? "#4A2C2A" : "#3A1C1A"} />
      </Cylinder>

      {/* Handle */}
      <Cylinder position={[0.2, 0.15, 0]} args={[0.02, 0.02, 0.15]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>

      {/* Interactive steam */}
      {isHot && (
        <>
          <CoffeeSteam position={[0, 0.25, 0]} />
          <CoffeeSteam position={[0.05, 0.25, 0.05]} />
          <CoffeeSteam position={[-0.05, 0.25, -0.05]} />
          
          {/* Steam particles */}
          <Sparkles 
            count={15} 
            scale={0.3} 
            size={1} 
            speed={1} 
            color="#ffffff"
            position={[0, 0.4, 0]}
          />
        </>
      )}
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
      <Plane position={[0, -2, 0]} args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      {/* Workspace components */}
      <Desk />
      <Monitor />
      <Laptop />
      <EnhancedCoffeeCup />
      <Keyboard />
      <Mouse />
      <Books />
      <Plant />
      <CPUTower />

      {/* New interactive elements */}
      <HolographicDisplay />
      <InteractiveParticles />
      <FloatingTools />
      
      {/* Environment effects */}
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0.5} speed={0.5} />
      <Cloud position={[-10, 5, -10]} speed={0.2} opacity={0.3} />
      <Cloud position={[10, 5, 10]} speed={0.3} opacity={0.2} />

      {/* Floating code particles */}
      <FloatingParticle position={[2, 1, 1]} color="#AA367C" symbol="{}" />
      <FloatingParticle position={[-2, 1.5, 1]} color="#4A2FBD" symbol="</>" />
      <FloatingParticle position={[1, 2, -1]} color="#7ee787" symbol="()" />
      <FloatingParticle position={[-1, 1.8, -1]} color="#ffa657" symbol="[]" />
      <FloatingParticle position={[0, 2.5, 0]} color="#79c0ff" symbol=";" />
      <FloatingParticle position={[2.5, 1.2, -0.5]} color="#f85149" symbol="<>" />

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
    <div style={{ 
      color: '#fff', 
      fontSize: '18px', 
      fontFamily: 'Centra, sans-serif',
      textAlign: 'center',
      background: 'rgba(0,0,0,0.7)',
      padding: '20px',
      borderRadius: '10px'
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
                Explore my fully interactive 3D developer workspace! Click the monitor to change screens, 
                interact with the coffee cup, and watch the holographic display respond to your presence. 
                This immersive environment showcases my technical skills with dynamic animations and interactive elements.
              </p>

              <div className="canvas-container">
                <Canvas
                  shadows
                  camera={{ position: [6, 4, 6], fov: 50 }}
                  style={{ height: '600px', borderRadius: '20px' }}
                  gl={{ antialias: true, alpha: true }}
                >
                  <Suspense fallback={<LoadingFallback />}>
                    <Scene />
                  </Suspense>
                </Canvas>
              </div>

              <div className="workspace-controls-info">
                <p>
                  <strong>Interactive Controls:</strong> Drag to rotate • Scroll to zoom • Right-click to pan • Click objects to interact
                </p>
                <p>
                  <strong>Interactive Features:</strong> Clickable monitor screens • Interactive coffee cup • Holographic display • 
                  Mouse-responsive particles • Floating workspace tools • Starfield environment
                </p>
                <p>
                  <strong>Animations:</strong> Screen glows • Spinning CPU fan • Steam effects • Floating elements • 
                  Dynamic lighting • Particle systems
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};