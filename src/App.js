import "./App.css";
import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./component/NavBar";
import { Banner } from "./component/Banner";
import { Skills } from "./component/Skills";
import { Projects } from "./component/Projects";
import { Contact } from "./component/Contact";
import { Footer } from "./component/Footer";
import { Terminal } from "./component/Terminal";
import { CurrentLearnings } from "./component/CurrentLearnings";
import { GitHubDashboard } from "./component/GitHubDashboard";
import { PageLoader } from "./component/PageLoader";
import { AdminPanel } from "./component/AdminPanel";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <PageLoader onLoadComplete={handleLoadComplete} />;
  }

  // Check if user is trying to access admin panel
  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  return (
    <div className="App">
      <NavBar />
      <div className="main-content">
        <Banner />
        <Terminal />
        <GitHubDashboard />
        <Skills />
        <CurrentLearnings />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

export default App;
