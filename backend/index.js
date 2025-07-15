import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hola desde el backend!' });
});

// In-memory list of puntos limpios
let puntos = [
  {
    id: 1,
    nombre: 'Biblioteca Central',
    material: 'Papel y Cartón',
    estado: 'Disponible',
    posicion: [-0.952, -80.744],
  },
  {
    id: 2,
    nombre: 'Facultad de Ingeniería',
    material: 'Plásticos',
    estado: '75% Lleno',
    posicion: [-0.9535, -80.745],
  },
  {
    id: 3,
    nombre: 'Cafetería Principal',
    material: 'Vidrio',
    estado: 'Disponible',
    posicion: [-0.9515, -80.746],
  },
  {
    id: 4,
    nombre: 'Centro de Estudiantes',
    material: 'Metales',
    estado: 'Disponible',
    posicion: [-0.9528, -80.7445],
  },
  {
    id: 5,
    nombre: 'Parqueo Principal',
    material: 'Plásticos',
    estado: 'Disponible',
    posicion: [-0.953, -80.744],
  },
  {
    id: 6,
    nombre: 'Laboratorios de Química',
    material: 'Vidrio',
    estado: '75% Lleno',
    posicion: [-0.9518, -80.7437],
  },
  {
    id: 7,
    nombre: 'Auditorio Uleam',
    material: 'Papel y Cartón',
    estado: 'Disponible',
    posicion: [-0.9532, -80.7461],
  },
  {
    id: 8,
    nombre: 'Entrada Uleam',
    material: 'Metales',
    estado: 'Disponible',
    posicion: [-0.9521, -80.7435],
  },
  {
    id: 9,
    nombre: 'Paraninfo Universitario',
    material: 'Papel y Cartón',
    estado: 'Disponible',
    posicion: [-0.9527, -80.7438],
  },
  {
    id: 10,
    nombre: 'Facultad de Arquitectura',
    material: 'Plásticos',
    estado: 'Disponible',
    posicion: [-0.953, -80.743],
  },
  {
    id: 11,
    nombre: 'Facultad de Economía',
    material: 'Vidrio',
    estado: 'Disponible',
    posicion: [-0.9513, -80.7452],
  },
  {
    id: 12,
    nombre: 'Facultad de Medicina',
    material: 'Papel y Cartón',
    estado: 'Disponible',
    posicion: [-0.951, -80.742],
  },
  {
    id: 13,
    nombre: 'Facultad de Ciencias Sociales',
    material: 'Metales',
    estado: 'Disponible',
    posicion: [-0.9534, -80.7465],
  },
  {
    id: 14,
    nombre: 'Estadio Universitario',
    material: 'Plásticos',
    estado: 'Disponible',
    posicion: [-0.9522, -80.7468],
  },
  {
    id: 15,
    nombre: 'Entrada Norte',
    material: 'Vidrio',
    estado: 'Disponible',
    posicion: [-0.9515, -80.7425],
  },
  {
    id: 16,
    nombre: 'Entrada Sur',
    material: 'Metales',
    estado: 'Disponible',
    posicion: [-0.9542, -80.7445],
  },
  {
    id: 17,
    nombre: 'Entrada Este',
    material: 'Papel y Cartón',
    estado: 'Disponible',
    posicion: [-0.952, -80.7418],
  },
];

app.get('/api/puntos', (req, res) => {
  res.json(puntos);
});

// Add a new punto limpio
app.post('/api/puntos', (req, res) => {
  const nuevo = req.body;
  const nextId = puntos.length ? Math.max(...puntos.map(p => p.id)) + 1 : 1;
  const punto = { id: nextId, ...nuevo };
  puntos.push(punto);
  res.status(201).json(punto);
});

// Delete a punto limpio
app.delete('/api/puntos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  puntos = puntos.filter(p => p.id !== id);
  res.json({ ok: true });
});

// Update a punto limpio
app.put('/api/puntos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updates = req.body;
  let punto = puntos.find(p => p.id === id);
  if (!punto) {
    return res.status(404).json({ error: 'Punto no encontrado' });
  }
  punto = { ...punto, ...updates };
  puntos = puntos.map(p => (p.id === id ? punto : p));
  res.json(punto);
});

app.get('/api/recompensas', (req, res) => {
  const recompensas = [
    { id: 1, nombre: 'Café Gratis', costo: 150 },
    { id: 2, nombre: 'Descuento Libros', costo: 300 }
  ];
  res.json(recompensas);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
