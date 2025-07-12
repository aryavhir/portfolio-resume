import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { NavBar } from "./component/NavBar";
import { Banner } from "./component/Banner";
import { Skills } from "./component/Skills";
import { Projects } from "./component/Projects";
import { GitHubDashboard } from "./component/GitHubDashboard";
import { Terminal } from "./component/Terminal";
import { Timeline } from "./component/Timeline";
import { Stats } from "./component/Stats";
import { CodePlayground } from "./component/CodePlayground";
import { Blog } from "./component/Blog";
import { Contact } from "./component/Contact";
import { Footer } from "./component/Footer";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <Skills />
      <Terminal />
      <Timeline />
      <Stats />
      <GitHubDashboard />
      <Projects />
      <CodePlayground />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
