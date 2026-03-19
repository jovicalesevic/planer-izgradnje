import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, SignIn, SignUp } from '@clerk/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import NoviProjekat from './pages/NoviProjekat';
import ProjekatDetalji from './pages/ProjekatDetalji';
import Institucije from './pages/Institucije';
import Kalkulator from './pages/Kalkulator';
import AIAsistent from './pages/AIAsistent';

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return children;
}

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/novi-projekat" element={<ProtectedRoute><NoviProjekat /></ProtectedRoute>} />
          <Route path="/projekat/:id" element={<ProtectedRoute><ProjekatDetalji /></ProtectedRoute>} />
          <Route path="/institucije" element={<ProtectedRoute><Institucije /></ProtectedRoute>} />
          <Route path="/kalkulator" element={<ProtectedRoute><Kalkulator /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AIAsistent /></ProtectedRoute>} />
          <Route path="/sign-in/*" element={<div style={{ display: 'flex', justifyContent: 'center', padding: '48px 16px' }}><SignIn routing="path" path="/sign-in" afterSignInUrl="/" /></div>} />
          <Route path="/sign-up/*" element={<div style={{ display: 'flex', justifyContent: 'center', padding: '48px 16px' }}><SignUp routing="path" path="/sign-up" afterSignUpUrl="/" /></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
