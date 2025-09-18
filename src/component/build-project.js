import React from "react";
import InfiniteMenu from "../asset/projects/InfiniteMenu"; // Update the path
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
  return (
    <section className="infinite-section" id="infinite-menu">
       <ScrambledText
  className="scrambled-text-demo"
  radius={100}
  duration={1.2}
  speed={0.5}
>
      <h2>My Projects</h2>
       Personal projects build/deployed by me.
       </ScrambledText>
        <div style={{ height: "600px", position: "relative" }}>
          <InfiniteMenu items={items} />
        </div>

    </section>
  );
};
