import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Plane, Text, Html, useTexture, Stars, Cloud, Sparkles } from '@react-three/drei';
import { Container, Row, Col } from 'react-bootstrap';
import * as THREE from 'three';

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

// Interactive Monitor Component with Integrated Terminal
const Monitor = ({ isFullscreen, onToggleFullscreen }) => {
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
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </Plane>

      {/* Terminal HTML overlay */}
      <Html
        position={[0, 0.2, 0.07]}
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
      <Monitor isFullscreen={isFullscreen} onToggleFullscreen={onToggleFullscreen} />
      <Laptop />
      <EnhancedCoffeeCup />
      <Keyboard />
      <Mouse />
      <Books />
      <Plant />
      <CPUTower />

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
        enablePan={!isFullscreen}
        enableZoom={!isFullscreen}
        enableRotate={!isFullscreen}
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
              <h2>My 3D Interactive Workspace</h2>
              <p>
                Experience a fully interactive 3D developer workspace with an integrated terminal! 
                Click the monitor screen to access the built-in terminal in fullscreen mode. 
                The terminal runs inside the 3D environment and features full command functionality.
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
                  <strong>Interactive Features:</strong> Click the monitor screen to access the integrated terminal in fullscreen mode!
                </p>
                <p>
                  <strong>Terminal Commands:</strong> Type "help" in the terminal to see available commands • Full command history • Interactive responses
                </p>
                <p>
                  <strong>Navigation:</strong> Drag to rotate • Scroll to zoom • Right-click to pan • ESC to exit fullscreen terminal
                </p>
                <p>
                  <strong>3D Elements:</strong> Interactive coffee cup • Spinning CPU fan • Floating particles • Dynamic lighting • Steam effects
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