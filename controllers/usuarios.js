const { response, request } = require('express');

const usuariosGet = (req, res = response) => {
    const {q, nombre = 'No name', page, limit = 1} = req.query;
    
    res.status(403).json({
        msg: 'get Api - controlador',
        q,
        nombre,
        page,
        limit
    });
};

const usuariosPut = (req, res = response) => {
    const id = req.params.id;
    
    res.status(201).json({
        msg: 'put Api - controlador',
        id
    });
};

const usuariosPost = (req, res = response) => {
    const {nombre, edad} = req.body;

    res.status(200).json({
        msg: 'post Api - controlador',
        nombre,
        edad
    });
};

const usuariosDelete = (req, res = response) => {
    res.status(400).json({
        msg: 'delete Api - controlador'
    });
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