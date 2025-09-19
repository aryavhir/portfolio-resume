import React, { Suspense } from "react";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./component/NavBar";
import { Banner } from "./component/Banner";
import { Skills } from "./component/Skills";
import { Projects } from "./component/Projects";
// import { GitHubDashboard } from "./component/GitHubDashboard";
import { Terminal } from "./component/Terminal";
import { Contact } from "./component/Contact";
import { Footer } from "./component/Footer";
import GradientBlinds from "./asset/background/GradientBlinds";
import ConditionalRender from "./components/ConditionalRender";

// Lazy load heavy 3D components
const InfiniteSection = React.lazy(() => import("./component/build-project").then(module => ({ default: module.InfiniteSection })));

function App() {
  return (
    <div className="App">
      <NavBar />

      {/* Unified Liquid Ether Background for Banner to Skills sections */}
      <div className="unified-liquid-sections">
        {/* Single Liquid Ether Background */}
        <div className="unified-liquid-background">
         <GradientBlinds
    gradientColors={['#FF9FFC', '#5227FF']}
    angle={0}
    noise={0.3}
    blindCount={12}
    blindMinWidth={50}
    spotlightRadius={0.5}
    spotlightSoftness={1}
    spotlightOpacity={1}
    mouseDampening={0.15}
    distortAmount={0}
    shineDirection="left"
    mixBlendMode="lighten"
  />
        </div>

        <Banner />
        
         <Skills />
        </div>
       
               
 <ConditionalRender
        fallback={
          <div style={{ 
            height: '600px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#fff',
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '10px' 
          }}>
            Loading 3D Projects...
          </div>
        }
        once={true}
      >
        <Suspense fallback={
          <div style={{ 
            height: '600px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#fff' 
          }}>
            Loading 3D Components...
          </div>
        }>
          <InfiniteSection />
        </Suspense>
      </ConditionalRender>
        {/* <GitHubDashboard /> */}
      

      <Projects />
         <Terminal />
      <Contact />
     
      <Footer />
    </div>
  );
}

export default App;
