const { Usuario } = require('../models');

class LoginController {

    index(req, res, next) {
        res.locals.error = '';
        res.locals.email = '';
        res.render('login')
    }

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

}

module.exports = LoginController;