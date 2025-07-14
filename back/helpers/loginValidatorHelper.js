import { check } from 'express-validator';

export const reglasValidacionLogin = [
    check("email")
        .escape()
        .notEmpty().withMessage("Debe ingresarse una dirección de e-mail")
        .bail()
        .isLength({ max: 30 }).withMessage("El e-mail no puede tener más de 30 caracteres")
        .bail()
        .isEmail().withMessage("Debe ingresarse una dirección de e-mail válida"),
    check("password")
        .escape()
        .notEmpty().withMessage("Se debe ingresar la contraseña")
        .bail()
        .isLength({ min: 8, max: 15 }).withMessage("La contraseña debe tener entre 8 y 15 caracteres")
];