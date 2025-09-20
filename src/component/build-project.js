import React, { useState, useEffect } from "react";
import InfiniteMenu from "../asset/projects/InfiniteMenu";
import project1 from '../asset/img/sourcebase.png'
import project2 from '../asset/img/modelia.png'
import project3 from '../asset/img/get-dots.png'
import project4 from '../asset/img/cafe.png'
import project7 from '../asset/img/car.png'
import project6 from '../asset/img/cloth.png'
import project5 from '../asset/img/news.png'
import ScrambledText from '../asset/text-animation/ScrambledText';

const items = [
  {
    image: project2,
    link: "https://modelia-project.vercel.app/",
    title: "Modelia",
    description: "Frontend generative ai concept project for interview"
  },
  {
    image: project3,
    link: "https://project-getdots.vercel.app/",
    title: "SearchUI",
    description: "This is pretty cool, right?"
  },
  {
    image: project1, 
    link: "https://www.sourcebase.in/",
    title: "Freelance", 
    description: "Intro to sourcebase"
  },
  {
    image: project4,
    link: "https://pub-2-hydro-test-7.vercel.app/", 
    title: "Cafe",
    description: "Dummy cafe website"
  },
  {
    image: project5,
    link: "https://news-app-rho-orpin.vercel.app/",
    title: "News",
    description: "Dummy news app"
  },
  {
    image: project6,
    link: "https://production-test-2.vercel.app/",
    title: "Cloth",
    description: "Dummy cloth store"
  },
  {
    image: project7,
    link: "https://pub1-website-1.vercel.app/",
    title: "Car",
    description: "Dummy car website"
  }
];

export const InfiniteSection = () => {
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    // Fade-in scroll observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-visible');
        }
      });
    }, observerOptions);

    // Observe all fade elements in infinite section
    const fadeElements = document.querySelectorAll('#infinite-menu .fade-element');
    fadeElements.forEach(element => {
      observer.observe(element);
    });

    // Auto-hide tutorial after 4 seconds
    const timer = setTimeout(() => {
      setShowTutorial(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      fadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <section className="infinite-section" id="infinite-menu">
      
      {/* Header text with fade-up effect */}
      <div className="fade-element fade-up">
        <ScrambledText
          className="scrambled-text-demo"
          radius={100}
          duration={1.2}
          speed={0.5}
        >
          <h2>My Projects</h2>
          Personal projects build/deployed by me.<br />
          Grab me and spin<br />
          ↓
        </ScrambledText>
      </div>
      
      {/* Infinite menu container with fade-scale effect */}
      <div className="fade-element fade-scale">
        <div style={{ height: "600px", position: "relative" }}>
          {showTutorial && (
            <div className="tutorial-overlay fade-element fade-bounce">
              <div className="ghost-hand">
                <span className="hand-emoji">👆</span>
                <div className="tutorial-text">Drag to spin!</div>
              </div>
            </div>
          )}
          <InfiniteMenu items={items} />
        </div>
      </div>
      
    </section>
  );
};