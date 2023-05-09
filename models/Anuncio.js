const mongoose = require('mongoose');

// definir el esquema de los anuncios
const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

// definir la lista de filtros
anuncioSchema.statics.lista = function(filtro, skip, limit, sort, fields) {
   const query = Anuncio.find(filtro);
   query.skip(skip);
   query.limit(limit);
   query.sort(sort);
   query.select(fields);
    //..
   return query.exec();
}

// crear el modelo del anuncio
const Anuncio = mongoose.model('Anuncio', anuncioSchema);


// exportar el modelo para utilizarlo en otras partes de mi app
module.exports = Anuncio;