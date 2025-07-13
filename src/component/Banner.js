import React from "react";

import { useState, useEffect } from "react";
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
  const [index, setIndex] = useState(1);
  const toRotate = ["Full Stack Developer", "React Specialist", "UI/UX Designer", "Problem Solver"];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
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
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <section className="banner" id="home">
      <NetworkBackground />
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="banner-content text-center">
              <div className="banner-title">
                Hello, I'm Aryavhir
              </div>
              <div className="banner-subtitle">
                Crafting digital experiences with passion and precision
              </div>
              <div className="txt-rotate" style={{ 
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)", 
                fontWeight: "600",
                color: "#AA367C",
                marginBottom: "3rem",
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                <span style={{ color: "rgba(255,255,255,0.8)" }}>I am a </span>
                <span style={{ 
                  background: "linear-gradient(135deg, #AA367C 0%, #4A2FBD 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>{text}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                marginTop: "2rem"
              }}>
                <button className="premium-btn primary">
                  View My Work
                </button>
                <button className="premium-btn secondary">
                  Get In Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};