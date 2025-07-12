
import React from 'react';
import { Banner } from "../component/Banner";
import { Skills } from "../component/Skills";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Monitor, MessageCircle } from 'lucide-react';

export const HomePage = () => {
  const quickLinks = [
    {
      title: "View My Projects",
      description: "Explore my latest work and coding achievements",
      link: "/projects",
      icon: <Code size={40} />,
      color: "#AA367C"
    },
    {
      title: "3D Workspace",
      description: "Interactive 3D model of my development setup",
      link: "/workspace",
      icon: <Monitor size={40} />,
      color: "#4A2FBD"
    },
    {
      title: "Get In Touch",
      description: "Let's connect and discuss opportunities",
      link: "/contact",
      icon: <MessageCircle size={40} />,
      color: "#7ee787"
    }
  ];

  return (
    <div>
      <Banner />
      <Skills />
      
      {/* Quick Navigation Section */}
      <section className="quick-nav-section" style={{ padding: '80px 0', background: '#121212' }}>
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5">
                <h2 style={{ 
                  fontSize: '45px', 
                  fontWeight: '700',
                  background: 'linear-gradient(45deg, #AA367C, #4A2FBD)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Explore My Portfolio
                </h2>
                <p style={{ color: '#B8B8B8', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                  Discover my journey as a developer through interactive sections
                </p>
              </div>
            </Col>
          </Row>
          <Row className="g-4">
            {quickLinks.map((item, index) => (
              <Col key={index} md={4}>
                <Link to={item.link} style={{ textDecoration: 'none' }}>
                  <Card className="h-100 quick-nav-card" style={{
                    background: 'linear-gradient(135deg, rgba(21, 21, 21, 0.9) 0%, rgba(18, 18, 18, 0.9) 100%)',
                    border: `1px solid ${item.color}40`,
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <Card.Body className="p-4 text-center">
                      <div style={{ color: item.color, marginBottom: '20px' }}>
                        {item.icon}
                      </div>
                      <Card.Title style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>
                        {item.title}
                      </Card.Title>
                      <Card.Text style={{ color: '#B8B8B8', fontSize: '16px', marginBottom: '20px' }}>
                        {item.description}
                      </Card.Text>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: item.color,
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        Explore <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '60px 0', background: '#0a0a0a' }}>
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: '32px', 
                  marginBottom: '40px',
                  fontWeight: '600'
                }}>
                  Quick Stats
                </h3>
                <Row>
                  {[
                    { number: '7+', label: 'Certificates Earned' },
                    { number: '3', label: 'Programming Languages' },
                    { number: '5+', label: 'Frameworks & Tools' },
                    { number: '∞', label: 'Learning Journey' }
                  ].map((stat, index) => (
                    <Col key={index} sm={6} md={3}>
                      <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ 
                          fontSize: '48px', 
                          fontWeight: '700', 
                          color: '#AA367C',
                          marginBottom: '10px'
                        }}>
                          {stat.number}
                        </h2>
                        <p style={{ color: '#B8B8B8', fontSize: '16px' }}>
                          {stat.label}
                        </p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};
