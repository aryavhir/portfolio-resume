import React, { useState, useEffect, memo } from "react";
import "./a.css";

// Main Banner Component - Memoized to prevent unnecessary re-renders
export const Banner = memo(() => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(120);

  const toRotate = ["Developer", "Programmer", "Gamer", "Tech Enthusiast"];
const typingDelay = 100; // normal typing speed
  const deletingDelay = 60; // faster deletion
  const pauseTime = 1000; // pause before deleting

  useEffect(() => {
    const tick = () => {
      let i = loopNum % toRotate.length;
      let fullText = toRotate[i];
      let updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        // pause before deleting
        setIsDeleting(true);
        setDelta(pauseTime);
      } else if (isDeleting && updatedText === "") {
        // move to next word
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
        setDelta(typingDelay);
      } else {
        // adjust speed
        setDelta(isDeleting ? deletingDelay : typingDelay);
      }
    };

    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text, isDeleting, loopNum, delta]);

  return (
    <section className="banner" id="home">
      {/* Banner Content */}
      <div className="banner-content">
        <h1 className="banner-hello">
          
          React developer by day, full-stack architect by nature.
        </h1>
        <div className="banner-text-container">
          <div className="txt-rotate">
            <span>I am a </span>
            <span>{text}</span>
            <span className="cursor">|</span> {/* blinking cursor */}
          </div>
        </div>
      </div>
    </section>
  );
});