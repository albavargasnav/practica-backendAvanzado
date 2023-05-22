const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// modulo que exporta un middleware
module.exports = async (req, res, next) => {
  try {

    // recoger el jwtToken de la cabecera, o del body o de la query-string
    const jwtToken = req.get('Authorization') || req.body.jwt || req.query.jwt;

    // comprobar que me han mandado un jwtToken
    if (!jwtToken) {
      const error = createError(401, 'no token provided')
      next(error);
      return;
    }

    // comprobar que el token es válido
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET)

    req.usuarioLogadoDelAPI = payload._id;

    next();

  } catch(err) {
    if (err.message === 'invalid signature') {
      next(createError(401, 'invalid token'));
      return;
    }
    next(err);
  }
}