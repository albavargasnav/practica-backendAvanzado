const mongoose = require('mongoose');

// crear esquema
const usuarioSchema = mongoose.Schema({
    email: String,
    password: String,
})

// crear el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

// exportar el modelo
module.exports = Usuario;