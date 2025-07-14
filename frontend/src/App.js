import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Bienvenida from './presentation/pages/Bienvenida';
import Dashboard from './presentation/pages/Dashboard';
import MapaPuntos from './presentation/pages/MapaPuntos';
import Recompensas from './presentation/pages/Recompensas';
import LoginPage from './presentation/pages/LoginPage';
import RegisterPage from './presentation/pages/RegisterPage';
import RegisterRecyclePage from './presentation/pages/RegisterRecyclePage';
import AccountPage from './presentation/pages/AccountPage';
import AdminPage from './presentation/pages/AdminPage';
import HelpPage from './presentation/pages/HelpPage';
import ContactPage from './presentation/pages/ContactPage';
import Reportes from './presentation/pages/Reportes';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import ThemeToggle from './presentation/components/ThemeToggle';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <Router basename={process.env.PUBLIC_URL}>
          <ThemeToggle />
          <Routes>
          <Route path="/" element={<Bienvenida />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/puntos" element={<MapaPuntos />} />
          <Route
            path="/recompensas"
            element={
              <ProtectedRoute>
                <Recompensas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registrar"
            element={
              <ProtectedRoute>
                <RegisterRecyclePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-perfil"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
            <Route
              path="/administrador"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/ayuda" element={<HelpPage />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/contacto" element={<ContactPage />} />
          </Routes>
        </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
