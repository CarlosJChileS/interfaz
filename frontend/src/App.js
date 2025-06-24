import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Bienvenida from './presentation/pages/Bienvenida';
import Dashboard from './presentation/pages/Dashboard';
import MapaPuntos from './presentation/pages/MapaPuntos';
import Recompensas from './presentation/pages/Recompensas';
import LoginPage from './presentation/pages/LoginPage';
import RegisterPage from './presentation/pages/RegisterPage';
import RegisterRecyclePage from './presentation/pages/RegisterRecyclePage';
import ProfilePage from './presentation/pages/ProfilePage';
import HistoryPage from './presentation/pages/HistoryPage';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router basename={process.env.PUBLIC_URL}>
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
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
