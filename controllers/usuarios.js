const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // mi respuesta es una colección de promesas
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
};

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, contraseña, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos

    if ( contraseña ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.contraseña = bcryptjs.hashSync( contraseña, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosPost = async(req, res = response) => {
    // se pasa al middlewares
    // const errors = validationResult(req);
    // if (!errors.isEmpty()){
    //     return res.status(400).json(errors);
    // }

    const { nombre, correo, contraseña, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, contraseña, rol });

    // Verificar si el correo existe
    // se pasa a db-validators
    // const existeEmail = await Usuario.findOne({ correo });
    // if ( existeEmail ) {
    //     return res.status(400).json({
    //         msg:'Ese correo ya está registrado'
    //     });
    // }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.contraseña = bcryptjs.hashSync( contraseña, salt );

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
};

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    const uid = req.uid;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    const usuarioAutenticado = req.usuario;

    res.json({usuario, uid, usuarioAutenticado});
};


const usuariosPatch = (req, res = response) => {
    res.status(403).json({
        msg: 'patch Api - controlador'
    });
};


module.exports = {
    usuariosGet,
    usuariosDelete,
    usuariosPatch,
    usuariosPost,
    usuariosPut
};