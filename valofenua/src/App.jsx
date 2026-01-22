import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Estimation from './pages/Estimation';
import RapportEstimation from './pages/RapportEstimation';
import About from './pages/About';
import Contact from './pages/Contact';
import MentionsLegales from './pages/MentionsLegales';
import CGV from './pages/CGV';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estimation" element={<Estimation />} />
        <Route path="/rapport" element={<RapportEstimation />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/cgv" element={<CGV />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
