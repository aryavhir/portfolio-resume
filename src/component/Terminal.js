import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";

export const Terminal = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPath, setCurrentPath] = useState("~");
  const [isAIMode, setIsAIMode] = useState(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message on component mount
  useEffect(() => {
    const welcomeMessages = [
      {
        type: "system",
        content: "Welcome to Aryavhir's Interactive Terminal! 🚀",
      },
      {
        type: "system",
        content: 'Type "help" to see available commands or start exploring!',
      },
      {
        type: "system",
        content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      },
    ];
    setOutput(welcomeMessages);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Typing animation effect
  const typeWriter = (text, delay = 10) => {
    return new Promise((resolve) => {
      setIsTyping(true);
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          setOutput((prev) => {
            const newOutput = [...prev];
            const lastItem = newOutput[newOutput.length - 1];
            if (lastItem && lastItem.type === "typing") {
              lastItem.content = text.substring(0, index + 1);
            } else {
              newOutput.push({
                type: "typing",
                content: text.substring(0, index + 1),
              });
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

  // Gemini AI API call
  const callGeminiAPI = async (message) => {
    try {
      const API_KEY = "AIzaSyC5MZQ4yNPMTPHm7_7Lgo3KhMDfT7sTZiI";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error:", response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts[0]
      ) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response format from Gemini API");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      if (error.message.includes("HTTP error! status: 403")) {
        return "❌ API key authentication failed. Please check the API key configuration.";
      } else if (error.message.includes("HTTP error! status: 429")) {
        return "⚠️ Rate limit exceeded. Please try again in a moment.";
      } else if (
        error.message.includes("models/gemini-pro is not found") ||
        error.message.includes("models/gemini-1.5-flash is not found")
      ) {
        return "❌ The model is no longer available. Updated to use gemini-2.0-flash.";
      } else {
        return `❌ Error connecting to AI service: ${error.message}. Please try again later.`;
      }
    }
  };

  // Fake loading animation
  const showLoading = (duration = 2000) => {
    return new Promise((resolve) => {
      const loadingFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
      let frameIndex = 0;

      setOutput((prev) => [
        ...prev,
        { type: "loading", content: `${loadingFrames[0]} Loading...` },
      ]);

      const timer = setInterval(() => {
        frameIndex = (frameIndex + 1) % loadingFrames.length;
        setOutput((prev) => {
          const newOutput = [...prev];
          const lastItem = newOutput[newOutput.length - 1];
          if (lastItem && lastItem.type === "loading") {
            lastItem.content = `${loadingFrames[frameIndex]} Loading...`;
          }
          return newOutput;
        });
      }, 100);

      setTimeout(() => {
        clearInterval(timer);
        setOutput((prev) => prev.filter((item) => item.type !== "loading"));
        resolve();
      }, duration);
    });
  };

  // Command processing
  const processCommand = async (cmd) => {
    const command = cmd.trim().toLowerCase();

    setOutput((prev) => [
      ...prev,
      {
        type: "command",
        content: `${isAIMode ? "ai@gemini" : "aryavhir@portfolio"}:${currentPath}$ ${cmd}`,
      },
    ]);

    // Add to command history
    if (cmd.trim()) {
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    // Handle AI mode
    if (isAIMode) {
      if (command === "end") {
        setIsAIMode(false);
        await typeWriter(`🤖 AI Session Ended
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Goodbye! You're back to the regular terminal.
Type 'help' to see available commands.`);
        return;
      }

      await showLoading(1500);
      const aiResponse = await callGeminiAPI(cmd);
      await typeWriter(`🤖 Gemini AI: ${aiResponse}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type your next question or 'end' to exit AI mode.`);
      return;
    }

    switch (command) {
      case "help":
        await typeWriter(`Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\x1b[32m🤖 NEW! AI Assistant:
  ai                - Chat with Gemini AI (type 'end' to exit)\x1b[0m

📋 General Commands:
  help              - Show this help menu
  clear             - Clear the terminal
  whoami            - About Aryavhir
  history           - Command history

🛠️  Developer Commands:
  skills --list     - Show technical skills
  skills --details  - Detailed skill breakdown
  projects          - Show recent projects
  experience        - Work experience

🎯 Interactive Commands:
  github            - GitHub statistics
  contact           - Contact information
  resume            - Download resume
  ascii             - Random ASCII art
  matrix            - Matrix rain effect

🎮 Fun Commands:
  joke              - Random programming joke
  quote             - Inspirational quote
  music             - Current Spotify playlist
  time              - Current time
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case "whoami":
        await showLoading(1500);
        await typeWriter(`👨‍💻 Aryavhir Koul
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Full Stack Developer & Tech Enthusiast
🎓 Bachelor's in Information Technology
🌟 Passionate about creating innovative solutions

💡 Current Focus:
  • Web Development (React, Node.js)
  • Mobile App Development
  • Machine Learning & AI
  • Open Source Contributions

🚀 Always learning, always building!`);
        break;

      case "skills --list":
        await showLoading(1000);
        await typeWriter(`🛠️  Technical Skills:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Programming Languages: JavaScript, TypeScript, Go, Swift, React Native
Frontend Technologies: React.js, HTML5, CSS3, SCSS
Backend Technologies: Node.js, RESTful APIs
Development Tools: Git, Figma, Latex
Miscellaneous: SQL, MetaMask Integration
Cloud Platforms: Amazon Web Services`);
        break;

      case "skills --details":
        await showLoading(2000);
        await typeWriter(`📊 Detailed Skill Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JavaScript        ██████████████████   80%
TypeScript        ████████████████     70%
React.js          ██████████████████   75%
Go                ████████████         55%
Swift             ███████████          50%
React Native      █████████████        60%
Node.js           ██████████████████   75%
HTML5/CSS3        ██████████████████   80%
Git               ████████████████     70%
AWS               ███████████          50%
SQL               █████████████        60%
RESTful APIs      ██████████████████   75%`);
        break;

      case "projects":
        await showLoading(1200);
        await typeWriter(`🚀 Personal Projects:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 📱 Portfolio Website
   Tech: React, Bootstrap, GitHub API
   Live: https://aryavhir.in
   Status: Published to GitHub

2. 🗳️ Blockchain Based Voting App
   Tech: Solidity, React, Remix Studio, Ganache, SepoliaETH
   Status: Published to GitHub

3. 🌱 IOT Based Automatic Plant Watering System
   Tech: Arduino UNO, C++, LCD Interface, Soil Sensors
   Status: Published to GitHub

Visit my GitHub for source code! 🔗`);
        break;

      case "experience":
        await showLoading(1500);
        await typeWriter(`💼 Work Experience:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 Software Development Engineer | Hydro Online (August 2024 – Present)

Ad Platform Engineering:
• Developed JavaScript-based, OpenRTB-compliant ad banner script with dynamic placement and real-time viewability tracking
• Built Advertisers Portal using React.js, TypeScript, and Go for campaign management
• Developed Publisher Rewards Calculation Website using Go and React

Payment Integrations:
• Developed Web Application with React.js and Web3 integration for MetaMask cryptocurrency purchases
• Integrated MoonPay SDK for onramp functionality as crypto payment option
• Implemented PayPal webhook integration and frontend SDK for seamless payment processing

Website Development & Management:
• Managed and expanded Hydro Online website using Webflow
• Optimized website structure and navigation for improved accessibility and user engagement
• Collaborated with designers and content creators for consistent branding

Current Project:
• Implementation of decentralized file transfer system for secure, peer-to-peer data sharing

Tools & Methodologies: Atlassian, Slack, Bitbucket, Jira`);
        break;

      case "github":
        await typeWriter(`🔗 Redirecting to GitHub Dashboard section...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Scroll up to view detailed GitHub statistics, 
   contribution graphs, and repository information!

✨ Or visit: https://github.com/aryavhir`);
        // Scroll to GitHub section
        setTimeout(() => {
          const githubSection = document.getElementById("github");
          if (githubSection) {
            githubSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 1000);
        break;

      case "contact":
        await typeWriter(`📞 Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: aryavhirkoul1@gmail.com
💼 LinkedIn: linkedin.com/in/aryavhir-koul-04a08k
🐙 GitHub: github.com/aryavhir
📱 Instagram: @aryavhir_koul

🌍 Location: India
💬 Preferred: Email or LinkedIn DM
⏰ Response Time: Usually within 24 hours`);
        break;

      case "joke":
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
          "Why do Java developers wear glasses? Because they can't C#! 👓",
          "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
          "Why did the programmer quit his job? He didn't get arrays! 📊",
          "There are only 10 types of people in the world: those who understand binary and those who don't! 👨‍💻",
          "Why did the programmer break up with the internet? Because there was no connection! 💔",
          "What's a programmer's favorite hangout place? The Foo Bar! 🍻",
        ];
        await typeWriter(
          `😄 ${jokes[Math.floor(Math.random() * jokes.length)]}`,
        );
        break;

      case "quote":
        const quotes = [
          '"Code is like humor. When you have to explain it, it\\\'s bad." - Cory House',
          '"First, solve the problem. Then, write the code." - John Johnson',
          '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
          '"In order to be irreplaceable, one must always be different." - Coco Chanel',
          '"The best way to predict the future is to invent it." - Alan Kay',
          '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
          "\"Programming isn't about what you know; it's about what you can figure out.\" - Chris Pine",
          '"The computer was born to solve problems that did not exist before." - Bill Gates',
        ];
        await typeWriter(
          `💭 ${quotes[Math.floor(Math.random() * quotes.length)]}`,
        );
        break;

      case "music":
        await showLoading(1000);
        await typeWriter(`🎵 Current Spotify Playlist:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎧 Now Playing: Coding Flow Mix
📻 Status: Active

🎶 Featured Tracks:
  • Lo-fi Hip Hop Beats
  • Ambient Electronic
  • Synthwave Classics
  • Focus & Deep Work Music

🔗 Listen along while I code! 🚀`);
        break;

      case "clear":
        setOutput([]);
        break;

      case "history":
        if (commandHistory.length === 0) {
          await typeWriter("No command history available.");
        } else {
          const historyText = commandHistory
            .map(
              (cmd, index) =>
                `${(index + 1).toString().padStart(3, " ")}  ${cmd}`,
            )
            .join("\n");
          await typeWriter(
            `Command History:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${historyText}`,
          );
        }
        break;

      case "time":
        const now = new Date();
        await typeWriter(`🕐 Current Time: ${now.toLocaleString()}
🌍 Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
📅 Day: ${now.toLocaleDateString("en-US", { weekday: "long" })}`);
        break;

      case "matrix":
        await typeWriter(`🔴 Entering the Matrix...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
01001000 01100101 01101100 01101100 01101111
01010111 01101111 01110010 01101100 01100100
01000001 01110010 01111001 01100001 01110110
01101000 01101001 01110010 00100000 01001011
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 Welcome to the real world, Neo.`);
        break;

      case "ascii":
        const asciiArts = [
          `    ___    ____  __  __ ___  _   __ __ __ ____ ____
   /   |  / __ \\/ / / //   |( ) / // //__/  __/ __/
  / /| | / /_/ / /_/ // /| ||/ / / __/ / / / / /_  
 / ___ |/ _, _/ __  // ___ |  / / /_  / / / / __/  
/_/  |_/_/ |_/_/ /_//_/  |_| /_/\\__/ /_/ /_/___/   `,
          `
╔═══════════════════════════════════════╗
║  Welcome to Aryavhir's Portfolio!     ║
║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║
║  Building the future, one line at a   ║
║  time! 🚀                             ║
╚═══════════════════════════════════════╝`,
          `
 █████╗ ██████╗ ██╗   ██╗ █████╗ ██╗   ██╗██╗  ██╗██╗██████╗ 
██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██║   ██║██║  ██║██║██╔══██╗
███████║██████╔╝ ╚████╔╝ ███████║██║   ██║███████║██║██████╔╝
██╔══██║██╔══██╗  ╚██╔╝  ██╔══██║╚██╗ ██╔╝██╔══██║██║██╔══██╗
██║  ██║██║  ██║   ██║   ██║  ██║ ╚████╔╝ ██║  ██║██║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝`,
          `
      ___           ___           ___           ___     
     /\\  \\         /\\  \\         /\\  \\         /\\  \\    
    /::\\  \\       /::\\  \\       /::\\  \\       /::\\  \\   
   /:/\\:\\  \\     /:/\\:\\  \\     /:/\\:\\  \\     /:/\\:\\  \\  
  /:/  \\:\\  \\   /::\\~\\:\\  \\   /::\\~\\:\\  \\   /::\\~\\:\\  \\ 
 /:/__/ \\:\\__\\ /:/\\:\\ \\:\\__\\ /:/\\:\\ \\:\\__\\ /:/\\:\\ \\:\\__\\
 \\:\\  \\  \\/__/ \\/__\\:\\/:/  / \\/_|::\\/:/  / \\:\\~\\:\\ \\/__/
  \\:\\  \\            \\::/  /     |:|::/  /   \\:\\ \\:\\__\\  
   \\:\\  \\           /:/  /      |:|\\/__/     \\:\\ \\/__/  
    \\:\\__\\         /:/  /       |:|  |        \\:\\__\\    
     \\/__/         \\/__/         \\|__|         \\/__/    `,
          `
    ╔══════════════════════════════════════╗
    ║             DEVELOPER                ║
    ║  ████████████████████████████████    ║
    ║  ██ Full Stack ██ React ██ Node ██   ║
    ║  ████████████████████████████████    ║
    ║         Code • Create • Innovate     ║
    ╚══════════════════════════════════════╝`,
          `
    ▄▄▄       ██▀███  ▓██   ██▓ ▄▄▄    
   ▒████▄    ▓██ ▒ ██▒ ▒██  ██▒▒████▄  
   ▒██  ▀█▄  ▓██ ░▄█ ▒  ▒██ ██░▒██  ▀█▄
   ░██▄▄▄▄██ ▒██▀▀█▄    ░ ▐██▓░░██▄▄▄▄██
    ▓█   ▓██▒░██▓ ▒██▒  ░ ██▒▓░ ▓█   ▓██▒
    ▒▒   ▓▒█░░ ▒▓ ░▒▓░   ██▒▒▒  ▒▒   ▓▒█░
     ▒   ▒▒ ░  ░▒ ░ ▒░ ▓██ ░▒░   ▒   ▒▒ ░
     ░   ▒     ░░   ░  ▒ ▒ ░░    ░   ▒   
         ░  ░   ░      ░ ░           ░  ░`,
          `
         .-..-. .-.  .-. .-. .-.  .-. .-.
        : ::  :: :  : :: :: :: : : :' :
        : :: .: :  : :: ': :\\. .: : : .  :
        '._.' '._.'  '.__.' '._.'.'._.'._.'
              F U L L   S T A C K
                D E V E L O P E R`,
          `
    ╭─────────────────────────────────────╮
    │  🚀 Welcome to the Digital Universe │
    │  ┌─────────────────────────────────┐ │
    │  │  > Building Dreams with Code_   │ │
    │  │  > Innovation through Logic_    │ │
    │  │  > Creating Digital Solutions_  │ │
    │  └─────────────────────────────────┘ │
    │         ~ Aryavhir Koul ~            │
    ╰─────────────────────────────────────╯`,
          `
    ██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
    ██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
    ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
    ██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝`,
          `
        ╔══════════════════════════════════╗
        ║   ╭─────────────────────────╮   ║
        ║   │     CODE  CRAFT  FLY    │   ║
        ║   │  ┌─────┐ ┌─────┐ ┌────┐ │   ║
        ║   │  │ <> │ │ {} │ │ () │ │   ║
        ║   │  └─────┘ └─────┘ └────┘ │   ║
        ║   ╰─────────────────────────╯   ║
        ║        Digital Architect         ║
        ╚══════════════════════════════════╝`,
        ];
        await typeWriter(
          asciiArts[Math.floor(Math.random() * asciiArts.length)],
        );
        break;

      case "resume":
        await showLoading(1000);
        await typeWriter(`📄 Resume Download:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Downloading Aryavhir's Resume...
📋 File: Aryavhir_Resume.pdf
💾 Starting download now...`);
        
        // Trigger download
        const link = document.createElement('a');
        link.href = '/attached_assets/Aryavhir_Resume (8)_1752396294063.pdf';
        link.download = 'Aryavhir_Koul_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(async () => {
          await typeWriter(`✅ Resume downloaded successfully!
📧 For any inquiries: aryavhirkoul1@gmail.com`);
        }, 1000);
        break;

      case "ai":
        setIsAIMode(true);
        await typeWriter(`🤖 Gemini AI Assistant Activated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Welcome to the AI chat! I'm powered by Google's Gemini.
Ask me anything about programming, technology, or general questions.

Type 'end' to exit AI mode and return to the terminal.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What would you like to know?`);
        break;

      default:
        if (command.startsWith("cd ")) {
          const dir = command.substring(3);
          setCurrentPath(dir === ".." ? "~" : dir);
          await typeWriter(`Changed directory to: ${dir === ".." ? "~" : dir}`);
        } else if (command === "") {
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
      setInput("");
    }
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <section className="terminal-section" id="terminal">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="terminal-container">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="btn-close"></span>
                  <span className="btn-minimize"></span>
                  <span className="btn-maximize"></span>
                </div>
                <div className="terminal-title">
                  Aryavhir@portfolio: ~/interactive-terminal
                </div>
              </div>

              <div
                className="terminal-body"
                ref={terminalRef}
                onClick={handleTerminalClick}
              >
                {output.map((line, index) => (
                  <div key={index} className={`terminal-line ${line.type}`}>
                    {line.content}
                  </div>
                ))}

                {!isTyping && (
                  <form onSubmit={handleSubmit} className="terminal-input-form">
                    <span className="terminal-prompt">
                      {isAIMode ? "ai@gemini" : "aryavhir@portfolio"}:
                      {currentPath}$
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="terminal-input"
                      autoComplete="off"
                      autoFocus
                    />
                  </form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
