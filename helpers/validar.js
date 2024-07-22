const validator = require("validator");

const validarArticulo = (parametros) => {
    try {
        const titulo = parametros.titulo || ""; // Asegurarse de que siempre haya un string
        const contenido = parametros.contenido || ""; // Asegurarse de que siempre haya un string

        let validar_titulo = !validator.isEmpty(titulo) &&
                             validator.isLength(titulo, { min: 5 });
        let validar_contenido = !validator.isEmpty(contenido);

        if (!validar_titulo || !validar_contenido) {
            return {
                status: "Error",
                mensaje: "Faltan datos por enviar"
            };
        }
    } catch (error) {
        return {
            status: "Error",
            mensaje: "Error en la validación"
        };
    }
    return null; // Si no hay error, devolver null
}

module.exports = {
    validarArticulo
}
