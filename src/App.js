
import "./App.css";

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
import { ScrollProgress } from "./component/ScrollProgress";

function App() {
  return (
    <div className="App">
      <PageLoader />
      <ScrollProgress />
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
