import "./App.css";
import React, { useState, useEffect } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./component/NavBar";
import { Banner } from "./component/Banner";
import { Skills } from "./component/Skills";
import { Projects } from "./component/Projects";
import { Contact } from "./component/Contact";
import { Footer } from "./component/Footer";
import { Terminal } from "./component/Terminal";
import { GitHubDashboard } from "./component/GitHubDashboard";
import { PageLoader } from "./component/PageLoader";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <PageLoader onLoadComplete={handleLoadComplete} />;
  }

  return (
    <div className="App">
      <NavBar />

      <Banner />
      <Terminal />
      <GitHubDashboard />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;