import { check } from 'express-validator';

export const reglasValidacionMensaje = [
    check("nombre")
        .escape()
        .notEmpty().withMessage("Debe ingresar nombre")
        .bail()
        .isLength({ min: 3, max: 30 }).withMessage("Nombre debe tener en 3 y 30 caracteres"),
    check("email")
        .escape()
        .notEmpty().withMessage("Debe ingresarse una dirección de e-mail")
        .bail()
        .isLength({ max: 30 }).withMessage("El e-mail no puede tener más de 30 caracteres")
        .bail()
        .isEmail().withMessage("Debe ingresarse una dirección de e-mail válida"),
    check("asunto")
        .escape()
        .notEmpty().withMessage("Debe ingresar asunto")
        .bail()
        .isLength({ min: 3, max: 30 }).withMessage("Asunto debe tener en 3 y 30 caracteres"),
    check("mensaje")
        .escape()
        .notEmpty().withMessage("El mensaje no puede quedar vacío")
        .bail()
        .isLength({ max: 140 }).withMessage("El mensaje debe tener 140 caracteres como máximo")
];