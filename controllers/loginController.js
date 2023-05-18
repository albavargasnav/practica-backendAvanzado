const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

class LoginController {

    index(req, res, next) {
        res.locals.error = '';
        res.locals.email = '';
        res.render('login')
    }
    // login post desde el website
    async post(req, res, next) {
        try { 
        const { email, password } = req.body;

        // buscar el usuario en la BD
        const usuario = await Usuario.findOne({ email: email });

        // si no lo encuentro o no coincide la contraseña --> error
        if (!usuario || ! (await usuario.comparePassword(password))) {
            res.locals.error = req.__('Invalid credentials');
            res.locals.email = email;
            res.render('login');
            return;
        }

        // si existe y la contraseña coincide
        // apuntar en la sesión del usuario, que está autenticado
        req.session.usuarioLogado = usuario._id;
        //--> redirigir a la zona privada
        res.redirect('/privado');
        } catch(err) {
            next(err);
        }
    }

    logout(req, res, next) {
        req.session.regenerate(err => {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/');
        })
    }
    // login post desde el API
    async postAPI(req, res, next) {
        try { 
        const { email, password } = req.body;

        // buscar el usuario en la BD
        const usuario = await Usuario.findOne({ email: email });

        // si no lo encuentro o no coincide la contraseña --> error
        if (!usuario || ! (await usuario.comparePassword(password))) {
            res.json({ error: 'invalid credentials'});
            return;
        }

        // si existe y la contraseña coincide
        // crear un JWT con el _id del usuario dentro
        const token = await jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
            expiresIn: '2d'
        })

        res.json({ jwt: token});
        } catch(err) {
            next(err);
        }
    }

}

module.exports = LoginController;