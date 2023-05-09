var express = require('express');
var router = express.Router();

const Anuncio = require('../models/Anuncio');

/* GET home page. */
// Devuelve una lista de anuncios
router.get('/', async function(req, res, next) {

  try {
  
  const anuncio = await Anuncio.find();

  res.render('index', { title: 'Lista de anuncios', anuncios: anuncio });

  } catch (err) {
    next(err);
  }

});

module.exports = router;


