const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

// GET /api/anuncio
// Devuelve una lista de anuncios
router.get('/', async (req, res, next) => {
  try {

    console.log('El _id del usuario que ha hecho la peticion es', req.usuarioLogadoDelAPI);

    //Cambiar en el texto de cada idioma desde controlador
    res.locals.texto = req.__('Text');

    //Lista de tags 
    res.locals.tags = [
      { name: ['Work','Lifestyle', 'Motor','Mobile']}
    ];

    //filtros
    const filtrarPorNombre = req.query.nombre;
    const filtrarPorTags = req.query.tags;
    const filtrarPorVenta = req.query.venta;
    const skip = req.query.skip;
    const limit = req.query.limit;
    const sort = req.query.sort;
    const fields = req.query.fields;
    
    const filtro = {};

    if (filtrarPorNombre) {
      filtro.nombre = { $regex: filtrarPorNombre, $options:'i' };
    }

    if (filtrarPorVenta){
      filtro.venta = filtrarPorVenta;     
    }

    if (filtrarPorTags){
      filtro.tags = { $regex: filtrarPorTags, $options:'i' };    
    }

    const anuncios = await Anuncio.lista(filtro, skip, limit, sort, fields);

    res.json({ results: anuncios });

  } catch (error) {
    next(error);
  }
});


// POST /api/anuncios(body)
// Crea un anuncio
router.post('/', async (req, res, next) => {
  try {

    const anuncioData = req.body;

    // creamos una instancia de anuncio en memoria
    const anuncio = new Anuncio(anuncioData);

    // la persistimos en la BD
    const anuncioGuardado = await anuncio.save();

    res.json({ result: anuncioGuardado });

  } catch (error) {
    next(error);
  }
});

module.exports = router;


