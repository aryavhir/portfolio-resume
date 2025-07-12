import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Plane, Text, Html, Stars, Sparkles } from '@react-three/drei';
import { Container, Row, Col } from 'react-bootstrap';

// Integrated Terminal Component inside the 3D Monitor
const IntegratedTerminal = ({ isFullscreen, onToggleFullscreen }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef(null);

  // Initialize terminal with welcome message
  useEffect(() => {
    if (output.length === 0) {
      const welcomeMessages = [
        { type: 'system', content: 'Welcome to 3D Workspace Terminal! 🚀' },
        { type: 'system', content: 'Type "help" for available commands' },
        { type: 'system', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
      ];
      setOutput(welcomeMessages);
    }
  }, [output.length]);

  // Handle ESC key for fullscreen exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        onToggleFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen, onToggleFullscreen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Typing animation
  const typeWriter = (text, delay = 30) => {
    return new Promise((resolve) => {
      setIsTyping(true);
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setOutput(prev => {
            const newOutput = [...prev];
            const lastItem = newOutput[newOutput.length - 1];
            if (lastItem && lastItem.type === 'typing') {
              lastItem.content = text.substring(0, index + 1);
            } else {
              newOutput.push({ type: 'typing', content: text.substring(0, index + 1) });
            }
            return newOutput;
          });
          index++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          resolve();
        }
      }, delay);
    });
  };

  // Command processing
  const processCommand = async (cmd) => {
    const command = cmd.trim().toLowerCase();

    setOutput(prev => [...prev, { type: 'command', content: `workspace@3d-monitor:~$ ${cmd}` }]);

    if (cmd.trim()) {
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    switch (command) {
      case 'help':
        await typeWriter(`🔧 3D Workspace Terminal Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Basic Commands:
  help              - Show this help menu
  clear             - Clear terminal
  whoami            - About the workspace
  ls                - List workspace contents
  status            - System status

🎮 Interactive Commands:
  coffee            - Check coffee levels
  lights            - Toggle workspace lights
  music             - Play workspace music
  focus             - Enter focus mode

🚀 Special Commands:
  matrix            - Matrix effect
  ascii             - ASCII art
  joke              - Programming jokes

💡 Navigation:
  fullscreen        - Enter fullscreen mode
  exit              - Exit fullscreen (or press ESC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'whoami':
        await typeWriter(`👨‍💻 3D Workspace System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  System: Interactive 3D Development Environment
🎯 Purpose: Immersive coding experience
💻 Features: Full 3D workspace simulation
🚀 Status: Fully operational and ready for development!`);
        break;

      case 'ls':
        await typeWriter(`📁 Workspace Contents:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
drwxr-xr-x  projects/          - Development projects
drwxr-xr-x  documents/         - Documentation
drwxr-xr-x  assets/            - Design assets
-rw-r--r--  coffee.log         - Coffee consumption logs
-rw-r--r--  todo.md            - Task list
-rw-r--r--  inspiration.txt    - Daily inspiration
📚 books/                      - Technical references
☕ coffee-cup                  - Currently brewing
🎵 music-player                - Background tunes`);
        break;

      case 'status':
        await typeWriter(`📊 Workspace Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🖥️  Monitor: ████████████████████ 100% Active
☕ Coffee:  ██████████████████   90% Full
💡 Lights:  ████████████████████ 100% Bright
🎵 Music:   ████████████████     80% Volume
🔋 Power:   ████████████████████ 100% Charged
📚 Books:   ████████████████████ 100% Available
🌱 Plant:   ████████████████████ 100% Healthy

🚀 All systems operational!`);
        break;

      case 'coffee':
        await typeWriter(`☕ Coffee System Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Level: ████████████████████ 90%
Temperature: Perfect brewing temperature
Steam: Active and flowing
Cups consumed today: 3
Last refill: 45 minutes ago
Status: FULLY CAFFEINATED & READY TO CODE! 🚀`);
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'matrix':
        await typeWriter(`🔴 Entering the Matrix...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
01110111 01101111 01110010 01101011 01110011
01110000 01100001 01100011 01100101 00110011
01100100 00100000 01101101 01101111 01101110
01101001 01110100 01101111 01110010 00100000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 Welcome to the 3D workspace, Neo.`);
        break;

      case 'fullscreen':
        onToggleFullscreen();
        await typeWriter('🚀 Entering fullscreen mode...');
        break;

      case 'exit':
        if (isFullscreen) {
          onToggleFullscreen();
          await typeWriter('📺 Exiting fullscreen mode...');
        } else {
          await typeWriter('Not in fullscreen mode. Use "fullscreen" to enter.');
        }
        break;

      case 'joke':
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
          "Why do Java developers wear glasses? Because they can't C#! 👓",
          "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?' 🍺"
        ];
        await typeWriter(`😄 ${jokes[Math.floor(Math.random() * jokes.length)]}`);
        break;

      case 'ascii':
        await typeWriter(`
╔═══════════════════════════════════════╗
║        3D WORKSPACE TERMINAL          ║
║  ████████████████████████████████████ ║
║  █ Welcome to the future of coding █  ║
║  ████████████████████████████████████ ║
║                                       ║
║  🚀 Building tomorrow, today! 🚀      ║
╚═══════════════════════════════════════╝`);
        break;

      default:
        if (command === '') {
          // Empty command, do nothing
        } else {
          await typeWriter(`Command not found: ${command}
Type 'help' to see available commands.`);
        }
    }
  };

  // Handle input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      processCommand(input);
      setInput('');
    }
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const terminalStyle = {
    width: '100%',
    height: '100%',
    background: '#0d1117',
    color: '#c9d1d9',
    fontFamily: 'Monaco, Menlo, monospace',
    fontSize: isFullscreen ? '14px' : '10px',
    padding: isFullscreen ? '20px' : '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: 'none',
    borderRadius: '8px',
  };

  const outputStyle = {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '10px',
    minHeight: 0,
  };

  const inputStyle = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#c9d1d9',
    fontFamily: 'Monaco, Menlo, monospace',
    fontSize: isFullscreen ? '14px' : '10px',
    flex: 1,
    marginLeft: '8px',
  };

  return (
    <div style={terminalStyle}>
      <div ref={terminalRef} style={outputStyle}>
        {output.map((line, index) => (
          <div key={index} style={{ 
            margin: '2px 0', 
            whiteSpace: 'pre-wrap',
            color: line.type === 'command' ? '#7ee787' : 
                   line.type === 'system' ? '#79c0ff' : 
                   line.type === 'typing' ? '#c9d1d9' : '#c9d1d9'
          }}>
            {line.content}
          </div>
        ))}
      </div>

      {!isTyping && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#7ee787', fontWeight: 'bold' }}>
            workspace@3d-monitor:~$ 
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={inputStyle}
            autoComplete="off"
            placeholder={isFullscreen ? "Enter command..." : "Type command..."}
          />
        </form>
      )}
    </div>
  );
};

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

// Enhanced Room with Better Design
const Room = () => {
  return (
    <group>
      {/* Floor with better texture */}
      <Plane position={[0, -2, 0]} args={[12, 12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.1} />
      </Plane>

      {/* Back wall */}
      <Plane position={[0, 1, -4]} args={[12, 6]} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </Plane>

      {/* Side walls */}
      <Plane position={[-6, 1, 0]} args={[8, 6]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </Plane>
      <Plane position={[6, 1, 0]} args={[8, 6]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </Plane>

      {/* Ceiling */}
      <Plane position={[0, 4, 0]} args={[12, 12]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#0f0f0f" roughness={0.9} />
      </Plane>
    </group>
  );
};

// Modern Desk Setup
const ModernDesk = () => {
  const [lightsOn, setLightsOn] = useState(true);

  return (
    <group 
      onClick={() => setLightsOn(!lightsOn)}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Main desk surface */}
      <Box position={[0, -0.5, 0]} args={[5, 0.1, 3]} castShadow receiveShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
      </Box>

      {/* Desk legs with modern design */}
      <Box position={[-2.2, -1.2, 1.2]} args={[0.15, 1.4, 0.15]} castShadow>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>
      <Box position={[2.2, -1.2, 1.2]} args={[0.15, 1.4, 0.15]} castShadow>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>
      <Box position={[-2.2, -1.2, -1.2]} args={[0.15, 1.4, 0.15]} castShadow>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>
      <Box position={[2.2, -1.2, -1.2]} args={[0.15, 1.4, 0.15]} castShadow>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>

      {/* RGB lighting strips */}
      <Box position={[0, -0.45, 1.4]} args={[4.8, 0.05, 0.1]} castShadow>
        <meshStandardMaterial 
          color={lightsOn ? "#AA367C" : "#333"} 
          emissive={lightsOn ? "#AA367C" : "#000"}
          emissiveIntensity={lightsOn ? 0.5 : 0}
        />
      </Box>
      <Box position={[0, -0.45, -1.4]} args={[4.8, 0.05, 0.1]} castShadow>
        <meshStandardMaterial 
          color={lightsOn ? "#4A2FBD" : "#333"} 
          emissive={lightsOn ? "#4A2FBD" : "#000"}
          emissiveIntensity={lightsOn ? 0.5 : 0}
        />
      </Box>
    </group>
  );
};

// Enhanced Monitor Setup
const MonitorSetup = ({ isFullscreen, onToggleFullscreen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const screenRef = useRef();

  useFrame((state) => {
    if (screenRef.current) {
      const glow = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      screenRef.current.material.emissiveIntensity = glow;
    }
  });

  return (
    <group position={[0, 0, -0.8]}>
      {/* Monitor arm */}
      <Box position={[0, 0.1, -0.2]} args={[0.08, 0.6, 0.08]} castShadow>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Monitor base */}
      <Cylinder position={[0, -0.35, 0]} args={[0.2, 0.2, 0.1]} castShadow>
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </Cylinder>

      {/* Monitor bezel */}
      <Box position={[0, 0.2, 0]} args={[1.3, 0.9, 0.12]} castShadow>
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Interactive screen */}
      <Plane 
        ref={screenRef}
        position={[0, 0.2, 0.07]} 
        args={[1.2, 0.8]} 
        onClick={onToggleFullscreen}
        onPointerOver={() => {
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setIsHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial 
          color="#0d1117"
          emissive="#0d1117"
          emissiveIntensity={isHovered ? 0.5 : 0.3}
          transparent
          opacity={0.9}
        />
      </Plane>

      {/* Screen glow effect */}
      {isHovered && (
        <Plane position={[0, 0.2, 0.08]} args={[1.4, 1]} transparent>
          <meshStandardMaterial 
            color="#AA367C" 
            emissive="#AA367C"
            emissiveIntensity={0.2}
            transparent
            opacity={0.3}
          />
        </Plane>
      )}

      {/* Terminal HTML overlay */}
      <Html
        position={[0, 0.2, 0.08]}
        transform
        distanceFactor={1}
        style={{
          width: '300px',
          height: '200px',
          pointerEvents: isFullscreen ? 'none' : 'auto',
        }}
      >
        <IntegratedTerminal 
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
        />
      </Html>
    </group>
  );
};

// Interactive Coffee Setup
const InteractiveCoffee = () => {
  const [isHot, setIsHot] = useState(true);
  const [coffeeLevel, setCoffeeLevel] = useState(0.8);
  const cupRef = useRef();

  useFrame((state) => {
    if (cupRef.current) {
      cupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const handleCoffeeClick = () => {
    setIsHot(!isHot);
    setCoffeeLevel(prev => prev > 0.2 ? prev - 0.1 : 1.0);
  };

  return (
    <group 
      ref={cupRef}
      position={[-1.8, -0.35, 0.8]}
      onClick={handleCoffeeClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Coffee cup */}
      <Cylinder position={[0, 0.15, 0]} args={[0.15, 0.12, 0.25]} castShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={0.1} metalness={0.9} />
      </Cylinder>

      {/* Coffee liquid */}
      <Cylinder position={[0, 0.05 + (coffeeLevel * 0.2), 0]} args={[0.14, 0.14, coffeeLevel * 0.2]} castShadow>
        <meshStandardMaterial color={isHot ? "#3a2317" : "#2a1a0f"} roughness={0.8} />
      </Cylinder>

      {/* Handle */}
      <Cylinder position={[0.2, 0.15, 0]} args={[0.02, 0.02, 0.15]} castShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={0.1} metalness={0.9} />
      </Cylinder>

      {/* Steam effects */}
      {isHot && coffeeLevel > 0.3 && (
        <>
          <CoffeeSteam position={[0, 0.25, 0]} />
          <CoffeeSteam position={[0.05, 0.25, 0.05]} />
          <CoffeeSteam position={[-0.05, 0.25, -0.05]} />

          <Sparkles 
            count={8} 
            scale={0.2} 
            size={1} 
            speed={1} 
            color="#ffffff"
            position={[0, 0.4, 0]}
          />
        </>
      )}

      {/* Coffee status indicator */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.08}
        color={isHot ? "#ff6b6b" : "#4ecdc4"}
        anchorX="center"
        anchorY="middle"
      >
        {isHot ? "HOT" : "COLD"}
      </Text>
    </group>
  );
};

// Modern Peripheral Setup
const PeripheralSetup = () => {
  return (
    <group>
      {/* Gaming keyboard */}
      <Box position={[0.5, -0.4, 0.8]} args={[1.6, 0.08, 0.6]} castShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
      </Box>

      {/* RGB key highlights */}
      {Array.from({ length: 12 }, (_, i) => (
        <Box key={i} position={[(-0.7 + i * 0.12), -0.35, 0.8]} args={[0.1, 0.03, 0.1]} castShadow>
          <meshStandardMaterial 
            color="#AA367C" 
            emissive="#AA367C" 
            emissiveIntensity={0.3}
          />
        </Box>
      ))}

      {/* Gaming mouse */}
      <Box position={[0.8, -0.38, 0.3]} args={[0.14, 0.08, 0.2]} castShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </Box>

      {/* Mouse RGB glow */}
      <Cylinder position={[0.8, -0.35, 0.3]} args={[0.08, 0.08, 0.02]} castShadow>
        <meshStandardMaterial 
          color="#4A2FBD" 
          emissive="#4A2FBD" 
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </Cylinder>

      {/* Mousepad */}
      <Plane position={[0.8, -0.44, 0.3]} args={[0.8, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#222" roughness={0.9} />
      </Plane>
    </group>
  );
};

// Tech Accessories
const TechAccessories = () => {
  return (
    <group>
      {/* Modern plant pot */}
      <Cylinder position={[-2.2, -0.3, -0.8]} args={[0.18, 0.15, 0.25]} castShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.8} />
      </Cylinder>

      {/* Plant */}
      <Cylinder position={[-2.2, -0.1, -0.8]} args={[0.02, 0.02, 0.4]} castShadow>
        <meshStandardMaterial color="#2d5a2d" />
      </Cylinder>

      <Sphere position={[-2.15, 0.15, -0.8]} args={[0.08]} castShadow>
        <meshStandardMaterial color="#3a7a3a" />
      </Sphere>
      <Sphere position={[-2.25, 0.12, -0.8]} args={[0.06]} castShadow>
        <meshStandardMaterial color="#3a7a3a" />
      </Sphere>

      {/* Modern speaker */}
      <Cylinder position={[2.2, -0.2, -0.8]} args={[0.15, 0.15, 0.3]} castShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </Cylinder>

      {/* Speaker grill */}
      <Cylinder position={[2.2, -0.05, -0.8]} args={[0.12, 0.12, 0.02]} castShadow>
        <meshStandardMaterial color="#333" roughness={0.8} />
      </Cylinder>

      {/* CPU Tower */}
      <Box position={[-2.2, -0.6, 0.8]} args={[0.4, 1, 0.5]} castShadow>
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </Box>

      {/* CPU Power LED */}
      <Cylinder position={[-2, 0.1, 0.8]} args={[0.03, 0.03, 0.02]} castShadow>
        <meshStandardMaterial 
          color="#00ff00" 
          emissive="#00ff00" 
          emissiveIntensity={0.8}
        />
      </Cylinder>

      {/* CPU Fan */}
      <SpinningFan position={[-2, -0.2, 1.05]} />
    </group>
  );
};

// Enhanced Lighting System
const LightingSystem = () => {
  return (
    <>
      {/* Main ambient lighting */}
      <ambientLight intensity={0.3} />

      {/* Key light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* Accent lighting */}
      <pointLight position={[0, 2, 0]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-3, 1, 2]} intensity={0.4} color="#AA367C" />
      <pointLight position={[3, 1, 2]} intensity={0.4} color="#4A2FBD" />

      {/* Monitor glow */}
      <pointLight position={[0, 0.5, -0.5]} intensity={0.3} color="#0d1117" />
    </>
  );
};

// Fullscreen Terminal Overlay
const FullscreenTerminal = ({ isFullscreen, onToggleFullscreen }) => {
  if (!isFullscreen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        width: '90%',
        height: '90%',
        background: '#0d1117',
        borderRadius: '12px',
        border: '2px solid #AA367C',
        boxShadow: '0 0 50px rgba(170, 54, 124, 0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #333',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28ca42' }}></div>
          </div>
          <div style={{ color: '#888', fontSize: '13px', fontFamily: 'Monaco, Menlo, monospace' }}>
            3D Workspace Terminal - Fullscreen Mode
          </div>
          <button 
            onClick={onToggleFullscreen}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ height: 'calc(100% - 60px)', padding: '0' }}>
          <IntegratedTerminal 
            isFullscreen={true}
            onToggleFullscreen={onToggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
};

// Main Scene Component
const Scene = ({ isFullscreen, onToggleFullscreen }) => {
  return (
    <>
      <LightingSystem />

      <Room />
      <ModernDesk />
      <MonitorSetup isFullscreen={isFullscreen} onToggleFullscreen={onToggleFullscreen} />
      <InteractiveCoffee />
      <PeripheralSetup />
      <TechAccessories />

      {/* Subtle environment effects */}
      <Stars radius={50} depth={50} count={500} factor={2} saturation={0.3} speed={0.3} />

      {/* Controls */}
      <OrbitControls
        enablePan={!isFullscreen}
        enableZoom={!isFullscreen}
        enableRotate={!isFullscreen}
        minDistance={4}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2.2}
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
        Click the monitor to access the integrated terminal!
      </div>
    </div>
  </Html>
);

// Main component
export const Workspace3D = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <section className="workspace-3d" id="workspace">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="workspace-3d-bx">
              <h2>My Modern 3D Workspace</h2>
              <p>
                Experience a professionally designed 3D developer workspace with realistic lighting and interactive elements. 
                Click the monitor screen to access the integrated terminal in fullscreen mode. Interact with various objects 
                like the coffee cup and RGB lighting to see dynamic responses.
              </p>

              <div className="canvas-container">
                <Canvas
                  shadows
                  camera={{ position: [6, 4, 6], fov: 50 }}
                  style={{ height: '600px', borderRadius: '20px' }}
                  gl={{ antialias: true, alpha: true }}
                >
                  <Suspense fallback={<LoadingFallback />}>
                    <Scene 
                      isFullscreen={isFullscreen} 
                      onToggleFullscreen={handleToggleFullscreen}
                    />
                  </Suspense>
                </Canvas>
              </div>

              <div className="workspace-controls-info">
                <p>
                  <strong>Interactive Features:</strong> Click monitor for terminal • Click coffee cup to toggle temperature • Click desk for RGB lighting
                </p>
                <p>
                  <strong>Terminal Commands:</strong> Type "help" for available commands • Full command history • Interactive system responses
                </p>
                <p>
                  <strong>Navigation:</strong> Drag to rotate • Scroll to zoom • ESC to exit fullscreen terminal mode
                </p>
                <p>
                  <strong>Modern Elements:</strong> RGB lighting effects • Realistic materials • Dynamic shadows • Professional aesthetics
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <FullscreenTerminal 
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </section>
  );
};