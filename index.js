const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

// Inicializar app 
console.log("App de Node arrancada");

// Conectar a la base de datos
conexion();

// Crear servidor node 
const app = express();
const puerto = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); //recibir datos con content type app/json
app.use(express.urlencoded({extended: true}));
//RUTAS
const rutas_articulo = require("./rutas/articulo");

//CARGO LAS RUTAS
app.use("/api", rutas_articulo);

//rutas prueba hardcodeadas
app.get("/probando", (req, res) => {

    console.log("Se ha ejecutado el endpoint probando");

    return res.status(200).json({
        curso: "master en react",
        autor: "victor robles",
        url: "victorroblesweb.com.es"  
    });
});

// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto);
});
