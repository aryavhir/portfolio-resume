import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const Terminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPath, setCurrentPath] = useState('~');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message on component mount
  useEffect(() => {
    const welcomeMessages = [
      { type: 'system', content: '🚀 Welcome to Aryavhir\'s Interactive Portfolio Terminal!' },
      { type: 'system', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
      { type: 'system', content: '👋 Hi there! I\'m a passionate Full Stack Developer who loves building' },
      { type: 'system', content: '   amazing web experiences. Navigate my portfolio using commands below:' },
      { type: 'system', content: '' },
      { type: 'system', content: '🎯 Quick Start Commands:' },
      { type: 'system', content: '   help       - View all available commands' },
      { type: 'system', content: '   whoami     - Learn more about me' },
      { type: 'system', content: '   skills     - Check out my technical skills' },
      { type: 'system', content: '   projects   - Explore my latest projects' },
      { type: 'system', content: '   contact    - Get in touch with me' },
      { type: 'system', content: '' },
      { type: 'system', content: '💡 Pro tip: Use arrow keys ↑↓ to navigate command history!' },
      { type: 'system', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
      { type: 'system', content: 'Ready to explore? Type a command and press Enter! 🎮' },
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
  const typeWriter = (text, delay = 50) => {
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

  // Fake loading animation
  const showLoading = (duration = 2000) => {
    return new Promise((resolve) => {
      const loadingFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      let frameIndex = 0;

      setOutput(prev => [...prev, { type: 'loading', content: `${loadingFrames[0]} Loading...` }]);

      const timer = setInterval(() => {
        frameIndex = (frameIndex + 1) % loadingFrames.length;
        setOutput(prev => {
          const newOutput = [...prev];
          const lastItem = newOutput[newOutput.length - 1];
          if (lastItem && lastItem.type === 'loading') {
            lastItem.content = `${loadingFrames[frameIndex]} Loading...`;
          }
          return newOutput;
        });
      }, 100);

      setTimeout(() => {
        clearInterval(timer);
        setOutput(prev => prev.filter(item => item.type !== 'loading'));
        resolve();
      }, duration);
    });
  };

  // Command processing
  const processCommand = async (cmd) => {
    const command = cmd.trim().toLowerCase();

    setOutput(prev => [...prev, { type: 'command', content: `aryavhir@portfolio:${currentPath}$ ${cmd}` }]);

    // Add to command history
    if (cmd.trim()) {
      setCommandHistory(prev => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    switch (command) {
      case 'help':
        await typeWriter(`Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 General Commands:
  help              - Show this help menu
  clear             - Clear the terminal
  whoami            - About Aryavhir
  ls                - List directory contents
  pwd               - Print working directory

🛠️  Developer Commands:
  skills --list     - Show technical skills
  skills --details  - Detailed skill breakdown
  projects          - Show recent projects
  projects --all    - Show all projects
  experience        - Work experience
  education         - Educational background

🎯 Interactive Commands:
  github            - GitHub statistics
  contact           - Contact information
  resume            - Download resume
  ascii             - Random ASCII art
  matrix            - Matrix rain effect

🎮 Fun Commands:
  joke              - Random programming joke
  quote             - Inspirational quote
  coffee            - Coffee status
  music             - Current playlist
  weather           - Check weather
  time              - Current time

🔧 System Commands:
  neofetch          - System information
  ps                - Running processes
  top               - System monitor
  history           - Command history
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        break;

      case 'whoami':
        await showLoading(1500);
        await typeWriter(`👨‍💻 Aryavhir Koul
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Full Stack Developer & Tech Enthusiast
🎓 Computer Science Student
🌟 Passionate about creating innovative solutions

💡 Current Focus:
  • Web Development (React, Node.js)
  • Mobile App Development
  • Machine Learning & AI
  • Open Source Contributions

🚀 Always learning, always building!`);
        break;

      case 'skills --list':
        await showLoading(1000);
        await typeWriter(`🛠️  Technical Skills:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend:    React, JavaScript, HTML5, CSS3, Bootstrap
Backend:     Node.js, Express.js, Python, Flask
Database:    MongoDB, MySQL, PostgreSQL
Tools:       Git, Docker, VS Code, Figma
Cloud:       AWS, Vercel, Netlify
Mobile:      React Native, Flutter basics
Others:      REST APIs, GraphQL, Socket.io`);
        break;

      case 'skills --details':
        await showLoading(2000);
        await typeWriter(`📊 Detailed Skill Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JavaScript       ████████████████████ 95%
React.js          ████████████████████ 90%
Node.js           ██████████████████   85%
Python            ████████████████     80%
CSS/HTML          ████████████████████ 95%
Git/GitHub        ██████████████████   85%
MongoDB           ███████████████      75%
AWS               ████████████         60%
Docker            ██████████           50%
Machine Learning  ████████             40%`);
        break;

      case 'projects':
        await showLoading(1200);
        await typeWriter(`🚀 Recent Projects:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 📱 Portfolio Website
   Tech: React, Bootstrap, GitHub API
   Live: https://aryavhir.vercel.app

2. 🛒 E-Commerce Platform
   Tech: MERN Stack, Stripe API
   Status: In Development

3. 🤖 AI Chatbot
   Tech: Python, OpenAI API, Flask
   Status: Completed

Type 'projects --all' for complete list!`);
        break;

      case 'projects --all':
        await showLoading(2000);
        await typeWriter(`📂 All Projects:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Portfolio Website (React) - Live
2. E-Commerce Platform (MERN) - In Development
3. AI Chatbot (Python/Flask) - Completed
4. Task Management App (React Native) - Completed
5. Weather Dashboard (JavaScript) - Completed
6. Social Media Clone (MERN) - In Progress
7. Machine Learning Model (Python) - Experimental
8. Chrome Extension (JavaScript) - Completed

Visit my GitHub for source code! 🔗`);
        break;

      case 'experience':
        await showLoading(1500);
        await typeWriter(`💼 Work Experience:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 Freelance Developer (2023 - Present)
   • Full-stack web development
   • Client consultation and project management
   • React, Node.js, MongoDB projects

🎓 Computer Science Student (2022 - Present)
   • Relevant coursework in algorithms, data structures
   • Group projects and hackathon participation
   • GPA: 3.8/4.0`);
        break;

      case 'github':
        await showLoading(2000);
        await typeWriter(`📊 GitHub Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Username: aryavhir
📚 Public Repos: 25+
⭐ Total Stars: 150+
🔄 Total Commits: 1000+
📈 Current Streak: 45 days
🏆 Contributions: Active daily

🔥 Most Used Languages:
   JavaScript  40%
   Python      25%
   HTML/CSS    20%
   Others      15%`);
        break;

      case 'contact':
        await typeWriter(`📞 Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: aryavhir.koul@example.com
💼 LinkedIn: linkedin.com/in/aryavhir-koul
🐙 GitHub: github.com/aryavhir
📱 Instagram: @aryavhir_koul

🌍 Location: India
💬 Preferred: Email or LinkedIn DM
⏰ Response Time: Usually within 24 hours`);
        break;

      case 'joke':
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
          "Why do Java developers wear glasses? Because they can't C#! 👓",
          "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?' 🍺",
          "Why did the programmer quit his job? He didn't get arrays! 📊"
        ];
        await typeWriter(`😄 ${jokes[Math.floor(Math.random() * jokes.length)]}`);
        break;

      case 'quote':
        const quotes = [
          '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
          '"First, solve the problem. Then, write the code." - John Johnson',
          '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
          '"In order to be irreplaceable, one must always be different." - Coco Chanel',
          '"The best way to predict the future is to invent it." - Alan Kay'
        ];
        await typeWriter(`💭 ${quotes[Math.floor(Math.random() * quotes.length)]}`);
        break;

      case 'coffee':
        await showLoading(1000);
        await typeWriter(`☕ Coffee Status:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Level: ████████████████████ 100%
Cups Today: 4 ☕☕☕☕
Last Refill: 30 minutes ago
Status: FULLY CAFFEINATED & READY TO CODE! 🚀`);
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'ls':
        await typeWriter(`📁 Directory Contents:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
drwxr-xr-x  projects/
drwxr-xr-x  skills/
drwxr-xr-x  experience/
drwxr-xr-x  education/
-rw-r--r--  resume.pdf
-rw-r--r--  README.md
-rw-r--r--  contact.txt`);
        break;

      case 'pwd':
        await typeWriter(`/home/aryavhir/portfolio`);
        break;

      case 'neofetch':
        await showLoading(1500);
        await typeWriter(`                   aryavhir@portfolio
                   ──────────────────────
       ██████      OS: Portfolio Linux
     ██████████    Host: Replit Container
   ████████████    Kernel: Node.js v18
   ████████████    Uptime: Always Online
   ████████████    Packages: npm, yarn
   ████████████    Shell: Interactive Terminal
   ████████████    Resolution: Responsive
     ██████████    Terminal: Custom React Terminal
       ██████      CPU: Full Stack Developer
                   Memory: Creative Ideas

                   🚀 Powered by passion & coffee!`);
        break;

      case 'history':
        if (commandHistory.length === 0) {
          await typeWriter('No command history available.');
        } else {
          const historyText = commandHistory.map((cmd, index) => 
            `${(index + 1).toString().padStart(3, ' ')}  ${cmd}`
          ).join('\n');
          await typeWriter(`Command History:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${historyText}`);
        }
        break;

      case 'time':
        const now = new Date();
        await typeWriter(`🕐 Current Time: ${now.toLocaleString()}
🌍 Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
📅 Day: ${now.toLocaleDateString('en-US', { weekday: 'long' })}`);
        break;

      case 'matrix':
        await typeWriter(`🔴 Entering the Matrix...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
01001000 01100101 01101100 01101100 01101111
01010111 01101111 01110010 01101100 01100100
01000001 01110010 01111001 01100001 01110110
01101000 01101001 01110010 00100000 01001011
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔵 Welcome to the real world, Neo.`);
        break;

      case 'ascii':
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
╚═══════════════════════════════════════╝`
        ];
        await typeWriter(asciiArts[Math.floor(Math.random() * asciiArts.length)]);
        break;

      default:
        if (command.startsWith('cd ')) {
          const dir = command.substring(3);
          setCurrentPath(dir === '..' ? '~' : dir);
          await typeWriter(`Changed directory to: ${dir === '..' ? '~' : dir}`);
        } else if (command === '') {
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
                <div className="terminal-title">Aryavhir@portfolio: ~/interactive-terminal</div>
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
                      aryavhir@portfolio:{currentPath}$ 
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