'use strict';

require('dotenv').config();

const { Anuncio, Usuario } = require('../models');

const connection = require('../lib/connectMongoose');
const fs = require('fs');
const path = require('path');
const anuncioDatos = fs.readFileSync(path.join(__dirname, '../routes/api/lista_de_anuncios.json'));
const init = JSON.parse(anuncioDatos);

main().catch(err => console.log('Hubo un error', err));

async function main() {

    // inicializamos coleccion de anuncios
    await initAnuncios();

    // inicializamos coleccion de usuarios
    await initUsuarios();

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

async function initUsuarios() {
    // borrar todos los documentos de usuarios
    const deleted = await Usuario.deleteMany();
    console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

    // crear usuarios iniciales
    const inserted = await Usuario.insertMany([
        { email: 'admin@example.com', password: await Usuario.hashPassword ('1234')},
        { email: 'user@example.com', password: await Usuario.hashPassword ('1234')},
    ]);
    console.log(`Creados ${inserted.lenght} usuarios.`);
}