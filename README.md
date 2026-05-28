# Proyecto Backend III - Adoptme

## Descripción

Sistema backend para la gestión de adopción de mascotas. API REST construida con **Express.js** y **MongoDB**, containerizada con Docker.

---

## Enlaces Importantes

- **Repositorio:** [`Link al repositorio`](https://github.com/ernesmorsucci/Proyecto-backend3.git)
- **Imagen Docker:** [`Link a la imagen`](https://hub.docker.com/r/ernesdev/adoptme-docker)

---

## Instalación y Ejecución

### Opción 1: Ejecución con Docker (Recomendado)

#### 1.1 Descargar la imagen

```bash
docker pull ernesdev/adoptme-docker:1.0.0
```

#### 1.2 Ejecutar el contenedor

```bash
docker run --name adoptme-image -e "MONGO_URL=url_mongodb" -e "PORT=9090" -p 3000:9090 adoptme-docker
```

**Parámetros importantes:**

- `-p 9090:9090`: Mapea puerto 9090 (interno a externo)
- `-e MONGO_URL`: URL de conexión a MongoDB (requerido)
- `-e PORT`: Puerto (recuerda usar el mismo puerto interno)

#### 1.3 Verificar que el contenedor está en ejecución

```bash
docker ps
```

---

### Opción 2: Ejecución Local

#### 2.1 Clonar el repositorio

```bash
git clone https://github.com/ernesmorsucci/Proyecto-backend3.git
cd Proyecto-backend3
```

#### 2.2 Instalar dependencias

```bash
npm install
```

#### 2.3 Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
MONGO_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/nombre_bd
NODE_ENV=development
PORT=9090
JWT_SECRET=tu_secret_jwt
```

#### 2.4 Iniciar el servidor

```bash
npm start
```

El servidor estará disponible en: `http://localhost:9090`

---

## Pruebas (Tests)

### Requisitos para ejecutar tests:

- Node.js instalado
- Dependencias instaladas (`npm install`)

### Ejecutar tests

```bash
npm test
```

### Qué cubren los tests

Los tests están ubicados en [src/test/adoption.router.test.js](src/test/adoption.router.test.js) y validan:

| Endpoint                   | Método | Escenarios                                                        |
| -------------------------- | ------ | ----------------------------------------------------------------- |
| `/api/adoptions/`          | GET    | Devuelve array de adopciones                                      |
| `/api/adoptions/:aid`      | GET    | Retorna 404 si no existe; 200 si existe                           |
| `/api/adoptions/:uid/:pid` | POST   | Validaciones: usuario existe, mascota existe, mascota no adoptada |

### Framework y herramientas de test

- **Mocha**: Framework de testing
- **Supertest**: Test de endpoints HTTP
- **Stubs**: Mocks para servicios (evita acceso a BD)

### Notas importantes

- Para ejecutar tests, la variable `NODE_ENV` en `.env` debe ser `"test"`
- Los tests no requieren conexión a MongoDB
- Timeout: 3 segundos (configurado en package.json)

---

## Evidencia de Pruebas

### Output esperado al ejecutar tests:

```
  adoption.router
    ✓ GET /api/adoptions/ - debería devolver un array de adopciones (45ms)
    ✓ GET /api/adoptions/:aid - debería retornar 404 si no existe (32ms)
    ✓ GET /api/adoptions/:aid - debería retornar 200 con adoption correcta (38ms)
    ✓ POST /api/adoptions/:uid/:pid - debería retornar 404 si usuario no existe (29ms)
    ✓ POST /api/adoptions/:uid/:pid - debería retornar 404 si mascota no existe (31ms)
    ✓ POST /api/adoptions/:uid/:pid - debería retornar 400 si mascota ya está adoptada (35ms)
    ✓ POST /api/adoptions/:uid/:pid - debería crear adoption correctamente (42ms)

  7 passing (272ms)
```

### Logs del contenedor Docker esperados:

```
Listening on 9090
Database conection success!
```

---

## Endpoints Principales

### Adopciones

- `GET /api/adoptions/` - Listar todas las adopciones
- `GET /api/adoptions/:aid` - Obtener adopción por ID
- `POST /api/adoptions/:uid/:pid` - Crear adopción (usuario + mascota)

### Mascotas

- `GET /api/pets/` - Listar mascotas
- `POST /api/pets/` - Crear mascota
- `PUT /api/pets/:pid` - Actualizar mascota
- `DELETE /api/pets/:pid` - Eliminar mascota

### Usuarios

- `GET /api/users/` - Listar usuarios
- `GET /api/users/:uid` - Obtener usuario
- `POST /api/users/` - Crear usuario
- `PUT /api/users/:uid` - Actualizar usuario

### Sesiones

- `POST /api/sessions/login` - Login de usuario
- `POST /api/sessions/logout` - Logout

---

## Documentación API

La documentación interactiva de la API está disponible con Swagger UI en:

**Local:** `http://localhost:9090/api/docs`  
**Docker:** `http://localhost:9090/api/docs` (después de iniciar el contenedor)

---

## Variables de Entorno

| Variable    | Descripción           | Ejemplo                                          |
| ----------- | --------------------- | ------------------------------------------------ |
| `MONGO_URL` | Conexión a MongoDB    | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NODE_ENV`  | Ambiente de ejecución | `development`, `production`, `test`              |
| `PORT`      | Puerto del servidor   | `9090`                                           |

---
