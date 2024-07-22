const mongoose = require("mongoose");

const conexion = async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/mi_blog");
        console.log("Conectado correctamente a la base de datos mi_blog");
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

module.exports = {
    conexion
}






/*const mongoose = require("mongoose");

const conexion = async() => {
    try{

        await mongoose.connect("mongodb://127.0.0.1:27017/blog"); 
        //await mongoose.connect("mongodb://localhost:27017/mi_blog");
        //parametro a pasar dentro de objeto
        //useNewUrlParser : true
        //useUnifiedTopology : true
        //useCreateIndex : index
        console.log("conectado correctamente a la base de datos mi_blog");

    } catch(error){
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos ");
    }
}

module.exports = {
    conexion
} */