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
import { CodePlayground } from './component/CodePlayground';

function App() {
  return (
    <div className="App">
      <NavBar />

      <Banner />
      <Terminal />
      <GitHubDashboard />
      <Skills />
      <Projects />
      <CodePlayground />
      <Terminal />
      <GitHubDashboard />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;