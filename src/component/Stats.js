
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AnimatedCounter = ({ end, duration = 2000, label, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="stat-item" style={{ textAlign: 'center', color: '#fff' }}>
      <div style={{ fontSize: '48px', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ fontSize: '48px', fontWeight: 'bold', margin: '10px 0' }}>
        {count}+
      </h3>
      <p style={{ fontSize: '18px', opacity: 0.8 }}>{label}</p>
    </div>
  );
};

export const Stats = () => {
  return (
    <section className="stats" style={{ 
      padding: '80px 0', 
      background: 'linear-gradient(90.21deg, #AA367C -5.91%, #4A2FBD 111.58%)' 
    }}>
      <Container>
        <Row>
          <Col lg={12}>
            <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: '60px', fontSize: '45px' }}>
              Portfolio Stats
            </h2>
          </Col>
        </Row>
        <Row>
          <Col md={3} sm={6}>
            <AnimatedCounter end={25} label="Projects Completed" icon="🚀" />
          </Col>
          <Col md={3} sm={6}>
            <AnimatedCounter end={50} label="GitHub Commits" icon="💻" />
          </Col>
          <Col md={3} sm={6}>
            <AnimatedCounter end={15} label="Technologies Learned" icon="⚡" />
          </Col>
          <Col md={3} sm={6}>
            <AnimatedCounter end={100} label="Cups of Coffee" icon="☕" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
