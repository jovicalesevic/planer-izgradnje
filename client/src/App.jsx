import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import NoviProjekat from './pages/NoviProjekat';
import ProjekatDetalji from './pages/ProjekatDetalji';
import Institucije from './pages/Institucije';
import Kalkulator from './pages/Kalkulator';
import AIAsistent from './pages/AIAsistent';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/novi-projekat" element={<NoviProjekat />} />
          <Route path="/projekat/:id" element={<ProjekatDetalji />} />
          <Route path="/institucije" element={<Institucije />} />
          <Route path="/kalkulator" element={<Kalkulator />} />
          <Route path="/ai" element={<AIAsistent />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
