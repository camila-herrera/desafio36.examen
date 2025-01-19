const express = require('express');
const app = express();

const cafes = require("./cafes.json")

app.listen(3001, console.log("SERVER ON en 3001"))

app.use(express.json())

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API de Cafés</title>
    </head>
    <body>
        <h1>Bienvenido a la API de Cafés</h1>
        <p>Esta API permite realizar operaciones CRUD sobre una lista de cafés.</p>
        <h2>Endpoints disponibles</h2>
        <ul>
            <li><strong>GET /cafes</strong>: Obtiene la lista de todos los cafés.</li>
            <li><strong>GET /cafes/:id</strong>: Obtiene un café específico por su ID.</li>
            <li><strong>POST /cafes</strong>: Agrega un nuevo café. Requiere un cuerpo con <code>{ id, nombre }</code>.</li>
            <li><strong>PUT /cafes/:id</strong>: Actualiza un café por ID. El ID del cuerpo debe coincidir con el de los parámetros.</li>
            <li><strong>DELETE /cafes/:id</strong>: Elimina un café por ID. Requiere un token en las cabeceras.</li>
        </ul>
    </body>
    </html>
    `);
  });
  
app.get("/cafes", (req, res) => {
    res.status(200).send(cafes)
})

app.get("/cafes/:id", (req, res) => {
    const { id } = req.params
    const cafe = cafes.find(c => c.id == id)
    if (cafe) res.status(200).send(cafe)
    else res.status(404).send({ message: "No se encontró ningún cafe con ese id" })
})

app.post("/cafes", (req, res) => {
    const cafe = req.body
    const { id } = cafe
    const existeUncafeConEseId = cafes.some(c => c.id == id)
    if (existeUncafeConEseId) res.status(400).send({ message: "Ya existe un cafe con ese id" })
    else {
        cafes.push(cafe)
        res.status(201).send(cafes)
    }
})

app.put("/cafes/:id", (req, res) => {
    const cafe = req.body;
    const { id } = req.params;
    if (id != cafe.id)
        return res
            .status(400)
            .send({
                message: "El id del parámetro no coincide con el id del café recibido",
            });

    const cafeIndexFound = cafes.findIndex((p) => p.id == id);
    if (cafeIndexFound >= 0) {
        cafes[cafeIndexFound] = cafe;
        res.send(cafes);
    } else {
        res
            .status(404)
            .send({ message: "No se encontró ningún café con ese id" });
    }
});

app.delete("/cafes/:id", (req, res) => {
    const jwt = req.header("Authorization")
    if (jwt) {
        const { id } = req.params
        const cafeIndexFound = cafes.findIndex(c => c.id == id)

        if (cafeIndexFound >= 0) {
            cafes.splice(cafeIndexFound, 1)
            console.log(cafeIndexFound, cafes)
            res.send(cafes)
        } else {
            res.status(404).send({ message: "No se encontró ningún cafe con ese id" })
        }

    } else res.status(400).send({ message: "No recibió ningún token en las cabeceras" })
})

app.use("*", (req, res) => {
    res.status(404).send({ message: "La ruta que intenta consultar no existe" })
});

module.exports = app
