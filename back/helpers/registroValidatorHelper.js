import { check } from 'express-validator';
import Usuario from '../models/usuarioMongo.js';

export const reglasValidacionRegistro = [
    check("nombreYApellido")
        .escape()
        .notEmpty().withMessage("Debe ingresarse nombre y apellido")
        .bail()
        .isLength({ min: 7, max: 40 }).withMessage("Nombre y apellido debe tener en 7 y 40 caracteres"),
    check("nacimiento")
        .notEmpty().withMessage("Debe ingresarse la fecha de nacimiento")
        .bail()
        .isDate().withMessage("La fecha de nacimiento debe indicarse con un dato tipo fecha (aaaa-mm-dd)"),
    check("email")
        .escape()
        .notEmpty().withMessage("Debe ingresarse una dirección de e-mail")
        .bail()
        .isLength({ max: 40 }).withMessage("El e-mail no puede tener más de 30 caracteres")
        .bail()
        .isEmail().withMessage("Debe ingresarse una dirección de e-mail válida")
        .bail()
        .custom(async (value) => {
            const usuario = await Usuario.findOne({ email: value });
            if (usuario) throw new Error("El e-mail ya se encuentra registrado");
            return true;
        }),
    check("telefono")
        .optional({ checkFalsy: true })
        .isNumeric().withMessage("Para indicar el teléfono hay que ingresar sólo números"),
    check("password")
        .escape()
        .notEmpty().withMessage("Se debe ingresar la contraseña")
        .bail()
        .isAlphanumeric().withMessage("La contraseña debe ser alfanumérica (sólo letras y números)")
        .bail()
        .isLength({ min: 8, max: 15 }).withMessage("La contraseña debe tener entre 8 y 15 caracteres")
];