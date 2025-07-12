
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export const CodePlayground = () => {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`);
  
  const [output, setOutput] = useState('');

  const runCode = () => {
    try {
      // Capture console.log output
      const originalLog = console.log;
      let logs = [];
      console.log = (...args) => {
        logs.push(args.join(' '));
      };
      
      // Execute the code
      eval(code);
      
      // Restore console.log
      console.log = originalLog;
      
      setOutput(logs.join('\n'));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <section className="code-playground" style={{ padding: '80px 0', background: '#1a1a1a' }}>
      <Container>
        <Row>
          <Col lg={12}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px' }}>
              <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '30px' }}>
                Interactive Code Playground
              </h2>
              <Row>
                <Col md={6}>
                  <h4 style={{ color: '#fff', marginBottom: '15px' }}>Code Editor</h4>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{
                      width: '100%',
                      height: '300px',
                      background: '#2d2d2d',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '15px',
                      fontFamily: 'Monaco, monospace',
                      fontSize: '14px'
                    }}
                  />
                  <Button 
                    onClick={runCode}
                    style={{ marginTop: '15px', background: '#AA367C', border: 'none' }}
                  >
                    Run Code 🚀
                  </Button>
                </Col>
                <Col md={6}>
                  <h4 style={{ color: '#fff', marginBottom: '15px' }}>Output</h4>
                  <div
                    style={{
                      height: '300px',
                      background: '#000',
                      color: '#00ff00',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '15px',
                      fontFamily: 'Monaco, monospace',
                      fontSize: '14px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {output || 'Click "Run Code" to see output...'}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
