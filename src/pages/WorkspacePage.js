
import React from 'react';
import { Workspace3D } from "../component/Workspace3D";
import { Container, Row, Col } from 'react-bootstrap';

export const WorkspacePage = () => {
  return (
    <div style={{ paddingTop: '100px' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 0', background: '#121212' }}>
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <h1 style={{ 
                  fontSize: '55px', 
                  fontWeight: '700',
                  background: 'linear-gradient(45deg, #AA367C, #4A2FBD)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '30px'
                }}>
                  Interactive 3D Workspace
                </h1>
                <p style={{ 
                  color: '#B8B8B8', 
                  fontSize: '20px', 
                  lineHeight: '1.6',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  Step into my virtual development environment. This interactive 3D model 
                  showcases my actual workspace setup with realistic animations and details.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Workspace3D />

      {/* Additional Info Section */}
      <section style={{ padding: '80px 0', background: '#0a0a0a' }}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="text-center">
                <h3 style={{ color: '#fff', fontSize: '32px', marginBottom: '30px' }}>
                  About This Workspace
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(170, 54, 124, 0.1) 0%, rgba(74, 47, 189, 0.1) 100%)',
                  border: '1px solid rgba(170, 54, 124, 0.3)',
                  borderRadius: '20px',
                  padding: '40px'
                }}>
                  <Row>
                    <Col md={6}>
                      <h5 style={{ color: '#AA367C', marginBottom: '15px' }}>Hardware Setup</h5>
                      <ul style={{ color: '#B8B8B8', textAlign: 'left', listStyle: 'none', padding: 0 }}>
                        <li>💻 Primary Development Machine</li>
                        <li>🖥️ External Monitor for Productivity</li>
                        <li>⌨️ Mechanical Keyboard</li>
                        <li>🖱️ Precision Mouse</li>
                      </ul>
                    </Col>
                    <Col md={6}>
                      <h5 style={{ color: '#4A2FBD', marginBottom: '15px' }}>Environment</h5>
                      <ul style={{ color: '#B8B8B8', textAlign: 'left', listStyle: 'none', padding: 0 }}>
                        <li>☕ Essential Coffee Station</li>
                        <li>📚 Reference Books</li>
                        <li>🌱 Plants for Fresh Air</li>
                        <li>💾 Development Rig</li>
                      </ul>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};
