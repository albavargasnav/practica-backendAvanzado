const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connection.on('error', err => {
    console.log('Error de conexión', err);
});

mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDB en', mongoose.connection.name);
})

mongoose.connect(process.env.MONGODB_CONNECTION_STR);

module.exports = mongoose.connection;