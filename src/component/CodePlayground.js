
import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

export const CodePlayground = () => {
  const [code, setCode] = useState(`// Welcome to Aryavhir's Code Playground!
// Try writing some JavaScript code here:

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test it out:
console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

// Try changing the code and hit "Run Code"!`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState('javascript');

  // Code templates for different languages
  const templates = {
    javascript: `// JavaScript Playground
function greet(name) {
  return \`Hello, \${name}! Welcome to my portfolio.\`;
}

console.log(greet("Developer"));
console.log("Current time:", new Date().toLocaleString());`,

    python: `# Python Playground (Simulated)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Print fibonacci sequence
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`,

    html: `<!DOCTYPE html>
<html>
<head>
    <title>Live Preview</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .highlight { color: #007bff; font-weight: bold; }
    </style>
</head>
<body>
    <h1 class="highlight">Hello from Aryavhir's Portfolio!</h1>
    <p>This is a live HTML preview. Try editing the code!</p>
    <button onclick="alert('Interactive!')">Click Me!</button>
</body>
</html>`
  };

  const executeCode = () => {
    setIsRunning(true);
    setOutput('');

    // Simulate code execution with delay
    setTimeout(() => {
      try {
        if (language === 'javascript') {
          // Capture console.log output
          const originalLog = console.log;
          let capturedOutput = '';
          
          console.log = (...args) => {
            capturedOutput += args.join(' ') + '\n';
          };

          // Execute the code safely
          const func = new Function(code);
          func();

          // Restore console.log
          console.log = originalLog;
          
          setOutput(capturedOutput || 'Code executed successfully!');
        } else if (language === 'python') {
          // Simulate Python execution
          setOutput(`🐍 Python Code Simulation:
Fibonacci sequence:
F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34`);
        } else if (language === 'html') {
          setOutput('✅ HTML rendered in preview window below');
        }
      } catch (error) {
        setOutput(`❌ Error: ${error.message}`);
      }
      setIsRunning(false);
    }, 1000);
  };

  const loadTemplate = (lang) => {
    setLanguage(lang);
    setCode(templates[lang]);
    setOutput('');
  };

  return (
    <section className="code-playground" id="playground">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="playground-bx">
              <h2>🚀 Interactive Code Playground</h2>
              <p>Write, edit, and execute code in real-time. Try different languages and see the magic happen!</p>
              
              <Row>
                <Col lg={8}>
                  <Card className="code-editor-card">
                    <Card.Header>
                      <div className="editor-header">
                        <div className="language-tabs">
                          {Object.keys(templates).map((lang) => (
                            <Button
                              key={lang}
                              variant={language === lang ? "primary" : "outline-secondary"}
                              size="sm"
                              onClick={() => loadTemplate(lang)}
                              className="me-2"
                            >
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="success"
                          onClick={executeCode}
                          disabled={isRunning}
                          className="run-btn"
                        >
                          {isRunning ? '⏳ Running...' : '▶️ Run Code'}
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <textarea
                        className="code-editor"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Write your code here..."
                        rows={15}
                      />
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={4}>
                  <Card className="output-card">
                    <Card.Header>
                      <h5>📤 Output</h5>
                      <Badge bg="secondary">{language}</Badge>
                    </Card.Header>
                    <Card.Body>
                      <div className="code-output">
                        {language === 'html' && output.includes('✅') ? (
                          <div>
                            <div className="output-text">{output}</div>
                            <div 
                              className="html-preview"
                              dangerouslySetInnerHTML={{ __html: code }}
                            />
                          </div>
                        ) : (
                          <pre className="output-text">{output || 'Click "Run Code" to see output...'}</pre>
                        )}
                      </div>
                    </Card.Body>
                  </Card>

                  <Card className="features-card mt-3">
                    <Card.Header>
                      <h6>✨ Features</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="feature-list">
                        <div className="feature-item">🔄 Real-time execution</div>
                        <div className="feature-item">🌐 Multiple languages</div>
                        <div className="feature-item">📱 Mobile responsive</div>
                        <div className="feature-item">🎨 Live HTML preview</div>
                        <div className="feature-item">⚡ Instant feedback</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
