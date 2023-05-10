const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// crear esquema
const usuarioSchema = mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
})

// método estático
usuarioSchema.statics.hashPassword = function(passwordEnClaro) {
    return bcrypt.hash(passwordEnClaro, 7)
}

// método de instancia
usuarioSchema.methods.comparePassword = function(passwordEnClaro) {
    return bcrypt.compare(passwordEnClaro, this.password);
}

// crear el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

// exportar el modelo
module.exports = Usuario;