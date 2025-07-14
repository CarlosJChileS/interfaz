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

app.get('/api/recompensas', (req, res) => {
  const recompensas = [
    { id: 1, nombre: 'Café Gratis', costo: 150 },
    { id: 2, nombre: 'Descuento Libros', costo: 300 }
  ];
  res.json(recompensas);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
