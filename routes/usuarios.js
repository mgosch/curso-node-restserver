const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole, tieneRole } = require('../middlewares');
const { esRoleValido, emailExiste, existeUsuarioPorId }= require('../helpers/db-validators');

const { usuariosGet, 
        usuariosDelete, 
        usuariosPatch, 
        usuariosPost, 
        usuariosPut } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id',[
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom(esRoleValido), 
        validarCampos
    ],usuariosPut );

router.post('/',[
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('contraseña', 'El contraseña debe de ser más de 6 letras').isLength({ min: 6 }),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom( emailExiste ),
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        // se pasa a db-validators
        // check('rol').custom( async(rol = '') => {
        //         const existeRol = await Role.findOne({ rol });
        //         if ( !existeRol ) {
        //                 throw new Error(`El rol ${ rol } no está registrado en la BD`);
        //         }
        // }), 
        check('rol').custom(esRoleValido),
        validarCampos
    ], usuariosPost );

router.delete('/:id',[
        validarJWT,
        // fuerza a que tenga que ser administrador
        // esAdminRole,
        tieneRole('VENTAS_ROLE', 'ADMIN_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
        ], usuariosDelete );

router.patch('/', usuariosPatch);

module.exports = router;