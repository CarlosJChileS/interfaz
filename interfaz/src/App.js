import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Bienvenida from './presentation/pages/Bienvenida';
import Dashboard from './presentation/pages/Dashboard';
import MapaPuntos from './presentation/pages/MapaPuntos';
import Recompensas from './presentation/pages/Recompensas';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/puntos" element={<MapaPuntos />} />
        <Route path="/recompensas" element={<Recompensas />} />
      </Routes>
    </Router>
  );
}

export default App;
