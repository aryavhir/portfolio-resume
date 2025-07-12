
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

export const Blog = () => {
  const articles = [
    {
      title: "Getting Started with Three.js",
      excerpt: "Learn how to create stunning 3D experiences on the web with Three.js. From basic scenes to interactive animations.",
      date: "Dec 2024",
      readTime: "5 min read",
      category: "Web Development",
      image: "🌐"
    },
    {
      title: "React Performance Optimization",
      excerpt: "Tips and tricks to make your React applications faster and more efficient. Covering useMemo, useCallback, and more.",
      date: "Nov 2024",
      readTime: "8 min read",
      category: "React",
      image: "⚡"
    },
    {
      title: "Building Responsive Designs",
      excerpt: "Creating beautiful, responsive web designs that work on all devices. Modern CSS techniques and best practices.",
      date: "Oct 2024",
      readTime: "6 min read",
      category: "CSS",
      image: "📱"
    }
  ];

  return (
    <section className="blog" style={{ padding: '80px 0', background: '#f8f9fa' }}>
      <Container>
        <Row>
          <Col lg={12}>
            <h2 style={{ textAlign: 'center', marginBottom: '60px', fontSize: '45px', color: '#333' }}>
              Latest Articles
            </h2>
          </Col>
        </Row>
        <Row>
          {articles.map((article, index) => (
            <Col md={4} key={index} style={{ marginBottom: '30px' }}>
              <Card style={{ 
                height: '100%', 
                border: 'none', 
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Card.Body style={{ padding: '30px' }}>
                  <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '20px' }}>
                    {article.image}
                  </div>
                  <div style={{ 
                    background: '#AA367C', 
                    color: '#fff', 
                    padding: '5px 15px', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    display: 'inline-block',
                    marginBottom: '15px'
                  }}>
                    {article.category}
                  </div>
                  <Card.Title style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                    {article.title}
                  </Card.Title>
                  <Card.Text style={{ color: '#666', marginBottom: '20px' }}>
                    {article.excerpt}
                  </Card.Text>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#999'
                  }}>
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};
