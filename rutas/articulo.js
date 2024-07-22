const express = require('express');
const router = express.Router();
const ArticuloControlador = require('../controladores/articulo');
const multer = require('multer');
const path = require('path');  // Importa el módulo path

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos');
    },
    filename: (req, file, cb) => {
        cb(null, "articulo-" + Date.now() + path.extname(file.originalname));  // Utiliza path.extname
    }
});

const subidas = multer({ storage: almacenamiento });

router.get('/ruta-de-prueba', ArticuloControlador.prueba);
router.get('/curso', ArticuloControlador.curso);
router.post('/crear', ArticuloControlador.crear);
router.get('/articulos', ArticuloControlador.listar);
router.get('/articulos/:id', ArticuloControlador.uno);
router.delete('/articulos/:id', ArticuloControlador.borrar);
router.put('/articulos/:id', ArticuloControlador.editar);
router.post('/subir-imagen/:id', subidas.single("file0"), ArticuloControlador.subir);  // Asegúrate de que subidas.single se pase como middleware

module.exports = router;
