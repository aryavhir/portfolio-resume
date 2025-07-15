import React, { useState, useEffect } from "react";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import "./a.css";

// Animated Network Background Component
const NetworkBackground = () => {
  return (
    <div className="network-background">
      <svg className="network-svg" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(170, 54, 124, 0.4)" />
            <stop offset="100%" stopColor="rgba(74, 47, 189, 0.4)" />
          </linearGradient>
        </defs>

        {/* Animated Lines */}
        <path d="M 100 200 L 300 150 L 500 180 L 700 120 L 900 160" 
              stroke="url(#lineGradient)" 
              strokeWidth="2" 
              fill="none"
              className="network-line line-1" />

        <path d="M 150 400 L 350 350 L 550 380 L 750 320 L 950 360" 
              stroke="url(#lineGradient)" 
              strokeWidth="2" 
              fill="none"
              className="network-line line-2" />

        <path d="M 200 600 L 400 550 L 600 580 L 800 520 L 1000 560" 
              stroke="url(#lineGradient)" 
              strokeWidth="2" 
              fill="none"
              className="network-line line-3" />

        {/* Connection Nodes */}
        <circle cx="300" cy="150" r="4" fill="rgba(170, 54, 124, 0.6)" className="network-node node-1" />
        <circle cx="500" cy="180" r="4" fill="rgba(74, 47, 189, 0.6)" className="network-node node-2" />
        <circle cx="700" cy="120" r="4" fill="rgba(170, 54, 124, 0.6)" className="network-node node-3" />
        <circle cx="550" cy="380" r="4" fill="rgba(74, 47, 189, 0.6)" className="network-node node-4" />
        <circle cx="750" cy="320" r="4" fill="rgba(170, 54, 124, 0.6)" className="network-node node-5" />
      </svg>
    </div>
  );
};

// Main Banner Component
export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const toRotate = ["Front-end Developer", "Web Developer", "Web Designer"];
  const period = 2000;

  const tick = React.useCallback(() => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(500);
    }
  }, [loopNum, isDeleting, text, toRotate, period]);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [delta, tick]);

  return (
    <section className="banner" id="home">
      <NetworkBackground />
      <h1 style={{ textAlign: "center" }}> Hello</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <div className="txt-rotate">
          <span>I am a </span>
          <span>{text}</span>
        </div>
      </div>
    </section>
  );
};

export const Ab = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const toRotate = [ "Full Stack Developer", "Mobile App Developer", "UI/UX Designer" ];
  const period = 2000;

  const tick = React.useCallback(() => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(500);
    }
  }, [loopNum, isDeleting, text, toRotate, period]);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [delta, tick]);

  return (
    <section className="banner" id="home">
      <div className="integration-badges">
        <span className="tech-badge">
          <i className="fab fa-github"></i> Live GitHub API
        </span>
        <span className="tech-badge">
          <i className="fas fa-robot"></i> AI-Powered Terminal
        </span>
        <span className="tech-badge">
          <i className="fas fa-envelope"></i> Real-time Contact
        </span>
      </div>
      <button onClick={() => console.log('connect')}>Let's Connect <ArrowRightCircle size={25} /></button>
    </section>
  );
};