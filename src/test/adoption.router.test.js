// Verificamos que el entorno sea de test para evitar correr tests en producción o desarrollo.
if(process.env.NODE_ENV !== 'test') {
    console.log('No se pueden ejecutar tests en un entorno que no sea test, revise el archivo .env');
    process.exit();
}
// Imports para llamadas HTTP y aserciones en los tests.
import request from 'supertest';
import Assert from 'assert';
import app from '../app.js';
import { adoptionService, petsService, usersService } from '../services/index.service.js';

const assert = Assert.strict;

describe('Test Adoption Routes', () => {
    beforeEach(function () {
        // Mocks: reemplazamos los métodos de servicio por stubs async para no usar la DB.
        adoptionService.getAll = async () => [];
        adoptionService.getBy = async () => null;
        adoptionService.create = async () => null;
        petsService.getBy = async () => null;
        petsService.update = async () => null;
        usersService.getUserById = async () => null;
        usersService.update = async () => null;
    });

    // GET /api/adoptions/ debe devolver un arreglo en payload.
    it('La ruta debe traer todas las adopciones en formato arreglo', async () => {
        adoptionService.getAll = async () => [{ _id: 'a1' }];
        const res = await request(app).get('/api/adoptions/');
        assert.strictEqual(Array.isArray(res.body.payload), true);
    });

    // GET /api/adoptions/:aid devuelve 404 si la adopción no existe.
    it('La ruta debe traer una adopción por su id - 404 si no existe', async () => {
        adoptionService.getBy = async () => null;
        const res = await request(app).get('/api/adoptions/nonexistent');
        assert.strictEqual(res.status, 404);
        assert.strictEqual(res.body.status, 'error');
    });

    // GET /api/adoptions/:aid devuelve 200 con el objeto de adopción cuando existe.
    it('La ruta debe traer una adopción por su id - 200 si existe', async () => {
        adoptionService.getBy = async ({ _id }) => ({ _id });
        const res = await request(app).get('/api/adoptions/existing');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.payload._id, 'existing');
    });

    // POST /api/adoptions/:uid/:pid devuelve 404 si el usuario no existe.
    it('Crear adopción - 404 user not found', async () => {
        usersService.getUserById = async () => null;
        const res = await request(app).post('/api/adoptions/uid/pid');
        assert.strictEqual(res.status, 404);
    });

    // POST /api/adoptions/:uid/:pid devuelve 404 si la mascota no existe.
    it('Crear adopción - 404 pet not found', async () => {
        usersService.getUserById = async () => ({ _id: 'u1', pets: [] });
        petsService.getBy = async () => null;
        const res = await request(app).post('/api/adoptions/u1/p1');
        assert.strictEqual(res.status, 404);
    });

    // POST /api/adoptions/:uid/:pid devuelve 400 si la mascota ya está adoptada.
    it('Crear adopción - 400 pet already adopted', async () => {
        usersService.getUserById = async () => ({ _id: 'u1', pets: [] });
        petsService.getBy = async () => ({ _id: 'p1', adopted: true });
        const res = await request(app).post('/api/adoptions/u1/p1');
        assert.strictEqual(res.status, 400);
    });

    // POST /api/adoptions/:uid/:pid crea la adopción correctamente si todo está bien.
    it('Crear adopción - 200 success', async () => {
        usersService.getUserById = async () => ({ _id: 'u1', pets: [] });
        petsService.getBy = async () => ({ _id: 'p1', adopted: false });
        usersService.update = async () => ({});
        petsService.update = async () => ({});
        adoptionService.create = async () => ({});
        const res = await request(app).post('/api/adoptions/u1/p1');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.status, 'success');
    });
});