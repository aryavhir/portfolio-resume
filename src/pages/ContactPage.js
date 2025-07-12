
import React from 'react';
import { Contact } from "../component/Contact";
import { Container, Row, Col } from 'react-bootstrap';

export const ContactPage = () => {
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
                  Let's Connect
                </h1>
                <p style={{ 
                  color: '#B8B8B8', 
                  fontSize: '20px', 
                  lineHeight: '1.6',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  I'm always excited to discuss new opportunities, collaborate on projects, 
                  or simply connect with fellow developers and tech enthusiasts.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Contact />

      {/* Additional Contact Info */}
      <section style={{ padding: '80px 0', background: '#0a0a0a' }}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="text-center">
                <h3 style={{ color: '#fff', fontSize: '32px', marginBottom: '40px' }}>
                  Other Ways to Reach Me
                </h3>
                <Row>
                  <Col md={4}>
                    <div style={{ marginBottom: '30px' }}>
                      <div style={{ 
                        fontSize: '40px', 
                        marginBottom: '15px',
                        color: '#AA367C'
                      }}>
                        💼
                      </div>
                      <h5 style={{ color: '#fff', marginBottom: '10px' }}>Professional</h5>
                      <p style={{ color: '#B8B8B8' }}>
                        Connect with me on LinkedIn for professional opportunities
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div style={{ marginBottom: '30px' }}>
                      <div style={{ 
                        fontSize: '40px', 
                        marginBottom: '15px',
                        color: '#4A2FBD'
                      }}>
                        🐙
                      </div>
                      <h5 style={{ color: '#fff', marginBottom: '10px' }}>Code</h5>
                      <p style={{ color: '#B8B8B8' }}>
                        Check out my repositories and contributions on GitHub
                      </p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div style={{ marginBottom: '30px' }}>
                      <div style={{ 
                        fontSize: '40px', 
                        marginBottom: '15px',
                        color: '#7ee787'
                      }}>
                        📧
                      </div>
                      <h5 style={{ color: '#fff', marginBottom: '10px' }}>Direct</h5>
                      <p style={{ color: '#B8B8B8' }}>
                        Use the contact form above for direct communication
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};
