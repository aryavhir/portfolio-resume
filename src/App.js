
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./component/NavBar";
import { Banner } from "./component/Banner";
import { Skills } from "./component/Skills";
import { TechStack } from "./component/TechStack";
import { Projects } from "./component/Projects";
import { Contact } from "./component/Contact";
import { Footer } from "./component/Footer";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Banner />
      <Skills />
      <TechStack />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
