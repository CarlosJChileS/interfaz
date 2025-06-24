import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hola desde el backend!' });
});

app.get('/api/puntos', (req, res) => {
  const puntos = [
    { id: 1, nombre: 'Biblioteca Central', estado: 'disponible' },
    { id: 2, nombre: 'Facultad de Ingeniería', estado: '75% lleno' },
  ];
  res.json(puntos);
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
