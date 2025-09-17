import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./component/NavBar";
import { Banner } from "./component/Banner";
import { Skills } from "./component/Skills";
import { Projects } from "./component/Projects";
import { GitHubDashboard } from "./component/GitHubDashboard";
import { Terminal } from "./component/Terminal";
import { Contact } from "./component/Contact";
import { Footer } from "./component/Footer";
import LiquidEther from "./asset/background/liquidEther";

function App() {
  return (
    <div className="App">
      <NavBar />

      {/* Unified Liquid Ether Background for Banner to Skills sections */}
      <div className="unified-liquid-sections">
        {/* Single Liquid Ether Background */}
        <div className="unified-liquid-background">
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        
        <Banner />
        <Terminal />
        <GitHubDashboard />
        <Skills />
      </div>
      
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
