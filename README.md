# Proyecto EcoGestor

El código se divide ahora en dos carpetas principales:

- **frontend**: aplicación React que contiene la interfaz de usuario.
- **backend**: API sencilla creada con Express.

Para probar cada parte de manera local:

```bash
cd backend
npm install
node index.js
```

```bash
cd ../frontend
npm install
npm start
```

El mapa interactivo usa **React Leaflet**. Si instalas las dependencias
por primera vez, asegúrate de que `leaflet` y `react-leaflet` estén
incluidos ejecutando nuevamente `npm install` en la carpeta `frontend`.

## Base de datos

Dentro de la carpeta `backend` se incluye el archivo `schema.sql` con las tablas necesarias para EcoGestor. Puedes ejecutarlo en tu servidor PostgreSQL de la siguiente manera:

```bash
psql -U tu_usuario -d tu_basedatos -f backend/schema.sql
```

Estas tablas cubren usuarios, perfiles, puntos limpios, solicitudes, recompensas y más.
