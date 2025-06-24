-- Script de base de datos para EcoGestor

-- Tabla de usuarios
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('estudiante', 'reciclador', 'administrador', 'institucion')),
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de perfiles (extensión de usuario)
CREATE TABLE perfil (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(id) ON DELETE CASCADE,
    foto_url VARCHAR(255),
    puntos INT DEFAULT 0,
    preferencias JSONB,
    datos_extra JSONB
);

-- Tabla de puntos limpios
CREATE TABLE punto_limpio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    direccion VARCHAR(255),
    tipo VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de solicitudes de recoleccion
CREATE TABLE solicitud_recoleccion (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(id) ON DELETE SET NULL,
    direccion VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    tipo_residuo VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente, en_proceso, completado, cancelado
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de recompensas
CREATE TABLE recompensa (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    puntos_necesarios INT NOT NULL,
    stock INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de canje de recompensas
CREATE TABLE canje_recompensa (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(id) ON DELETE SET NULL,
    recompensa_id INT REFERENCES recompensa(id) ON DELETE SET NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'solicitado' -- solicitado, entregado, cancelado
);

-- Tabla de reportes/denuncias
CREATE TABLE reporte (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(id) ON DELETE SET NULL,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    ubicacion VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'abierto' -- abierto, cerrado
);

-- Tabla de auditoria/historial de acciones
CREATE TABLE historial (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuario(id) ON DELETE SET NULL,
    accion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tablas de roles y permisos
CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE permiso (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE rol_permiso (
    rol_id INT REFERENCES rol(id) ON DELETE CASCADE,
    permiso_id INT REFERENCES permiso(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE usuario_rol (
    usuario_id INT REFERENCES usuario(id) ON DELETE CASCADE,
    rol_id INT REFERENCES rol(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

