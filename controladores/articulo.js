const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");
const path = require('path');
const fs = require('fs');

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlador de artículos"
    });
};

const curso = (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");

    return res.status(200).json([
        {
            curso: "master en react",
            autor: "victor robles",
            url: "victorroblesweb.com.es"  
        },
        {
            curso: "master en react",
            autor: "victor robles",
            url: "victorroblesweb.com.es" 
        }
    ]);
};

const crear = async (req, res) => {
    let parametros = req.body;

    // Validar los datos del artículo
    const validationError = validarArticulo(parametros);
    if (validationError) {
        return res.status(400).json(validationError);
    }

    // Crear el objeto a guardar
    const articulo = new Articulo(parametros);

    try {
        const articuloGuardado = await articulo.save();
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Artículo creado con éxito!!"
        });
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            mensaje: "No se ha guardado el artículo"
        });
    }
};

const listar = async (req, res) => {
    try {
        let query = Articulo.find({}).sort({ fecha: -1 });

        if (req.query.limite) {
            const limite = parseInt(req.query.limite, 10);

            if (!isNaN(limite)) {
                query = query.limit(limite);
            }
        }

        const articulos = await query;

        if (!articulos.length) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado artículos"
            });
        }

        return res.status(200).json({
            status: "success",
            articulos
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al obtener los artículos"
        });
    }
};

const uno = async (req, res) => {
    try {
        let id = req.params.id;

        const articulo = await Articulo.findById(id);

        if (!articulo) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al obtener el artículo"
        });
    }
};

const borrar = async (req, res) => {
    let articuloId = req.params.id;

    try {
        const articuloBorrado = await Articulo.findOneAndDelete({ _id: articuloId });

        if (!articuloBorrado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo"
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "Artículo borrado correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al borrar el artículo"
        });
    }
};

const editar = async (req, res) => {
    let articuloId = req.params.id;
    let parametros = req.body;

    // Validar parámetros
    const validationError = validarArticulo(parametros);
    if (validationError) {
        console.log("Error de validación:", validationError);
        return res.status(400).json(validationError);
    }

    try {
        const articuloActualizado = await Articulo.findOneAndUpdate(
            { _id: articuloId },
            parametros,
            { new: true }
        );

        if (!articuloActualizado) {
            return res.status(404).json({
                status: "Error",
                mensaje: "No se encontró el artículo para actualizar."
            });
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            mensaje: "Error al actualizar el artículo."
        });
    }
};

const subir = async (req, res) => {
    try {
        // Recoger el fichero de imagen subido
        const archivo = req.file;

        if (!archivo) {
            return res.status(400).json({
                status: "Error",
                mensaje: "No se ha subido ningún archivo"
            });
        }

        // Conseguir el nombre del archivo
        const nombreArchivo = archivo.filename;

        // Conseguir la extensión del archivo
        const extensionArchivo = path.extname(archivo.originalname).toLowerCase();

        // Comprobar la extensión correcta
        const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];
        if (!extensionesPermitidas.includes(extensionArchivo)) {
            // Eliminar el archivo subido si la extensión no es válida
            fs.unlink(archivo.path, (err) => {
                if (err) console.error("Error al eliminar archivo subido:", err);
            });
            return res.status(400).json({
                status: "Error",
                mensaje: "Extensión de archivo no permitida"
            });
        }

        // Obtener el ID del artículo desde los parámetros de la ruta
        const articuloId = req.params.id;

        try {
            // Actualizar el artículo con el nuevo nombre de archivo
            const articuloActualizado = await Articulo.findByIdAndUpdate(
                articuloId,
                { $set: { imagen: nombreArchivo } },
                { new: true }
            );

            if (!articuloActualizado) {
                return res.status(404).json({
                    status: "Error",
                    mensaje: "No se encontró el artículo para actualizar"
                });
            }

            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                mensaje: "Imagen subida y artículo actualizado con éxito"
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                mensaje: "Error al actualizar el artículo"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            mensaje: "Error al manejar la subida del archivo"
        });
    }
};    

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir
};
