const { response } = require('express');
const bcryptjs = require('bcryptjs');

// const Usuario = require('../models/usuario');
const { Usuario } = require('../models');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {

    const { correo, contraseña } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validContraseña = bcryptjs.compareSync( contraseña, usuario.contraseña );
        if ( !validContraseña ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - contraseña'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}

const googleSignIn = async(req, res = response) => {

    const {id_token} = req.body;
    
    try {
        const {nombre, imagen, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                rol: 'USER_ROLE',
                contraseña: ':P',
                imagen,
                google: true,
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB 
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        });
        
    }
}



module.exports = {
    login,
    googleSignIn
}
