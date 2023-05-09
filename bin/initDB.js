'use strict';

const Anuncio = require('../models/Anuncio');
const connection = require('../lib/connectMongoose');
const fs = require('fs');
const path = require('path');
const anuncioDatos = fs.readFileSync(path.join(__dirname, '../routes/api/lista_de_anuncios.json'));
const init = JSON.parse(anuncioDatos);

main().catch(err => console.log('Hubo un error', err));

async function main() {

    // inicializamos coleccion de anuncios
    await initAnuncios();

    connection.close();

}

async function initAnuncios () {
    // borra todos los documentos de la coleccion de anuncios
    const deleted = await Anuncio.deleteMany();
    console.log(`Eliminados ${deleted.deletedCount} anuncios.`);

    // crear anuncios iniciales
    const inserted = await Anuncio.insertMany(init);

    console.log(`Creados ${inserted.lenght} anuncios`);
}