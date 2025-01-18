const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
    const request = require("supertest");
    const server = require("../index");
    
        // 1. Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto
        it("Debería devolver un código 200 y un arreglo con al menos un objeto", async () => {
            const response = await request(server).get("/cafes").send();
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
        });
    
        // 2. Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe
        it("Debería devolver un código 404 al eliminar un café con ID inexistente", async () => {
            const nonExistentId = 9999;
            const response = await request(server)
                .delete(`/cafes/${nonExistentId}`)
                .set("Authorization", "Bearer token_valido")
                .send();
            expect(response.statusCode).toBe(404);
        });
        
    
        // 3. Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201
        it("Debería agregar un nuevo café y devolver un código 201", async () => {
            const newCafe = { id: Math.floor(Math.random() * 1000), nombre: "Café de prueba" };
            const response = await request(server).post("/cafes").send(newCafe);
            expect(response.statusCode).toBe(201);
            expect(response.body).toContainEqual(newCafe);
        });
    
        // 4. Prueba que la ruta PUT /cafes devuelve un código 400 si el ID del parámetro difiere del payload
        it("Debería devolver un código 400 si el ID del parámetro difiere del payload", async () => {
            const cafeActualizado = { id: 1, nombre: "Café actualizado" };
            const response = await request(server).put("/cafes/2").send(cafeActualizado);
            expect(response.statusCode).toBe(400);
        });
    
    });
