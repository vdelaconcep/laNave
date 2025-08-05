import { check } from 'express-validator';

export const reglasValidacionCodigo = [
    check("codigo")
        .escape()
        .notEmpty().withMessage("Debe ingresar un código de descuento para crear")
        .bail()
        .isLength({ min: 5, max: 10 }).withMessage("El código de descuento debe tener entre 5 y 10 caracteres"),
    check("tipoProducto")
        .escape()
        .notEmpty().withMessage("Debe ingresarse el tipo de producto para aplicarle el código de descuento")
        .bail()
        .custom((value) => {
            const tiposPosibles = ['remeras', 'buzos', 'mochilas', 'remera', 'buzo', 'mochila', 'todos', 'todo'];
            if (!tiposPosibles.includes(value)) {
                throw new Error('El tipo de producto debe ser uno de los siguientes: "remeras", "buzos", "mochilas" o "todos"')
            }
            return true;
        }),
    check("descuento")
        .notEmpty().withMessage("Debe ingresar el porcentaje de descuento a aplicar")
        .bail()
        .isInt({ min: 0, max: 100 }).withMessage("El descuento debe ser un número entre 0 y 100 (representa un porcentaje)"),
    check("banda")
        .optional({ checkFalsy: true })
        .escape()
        .isLength({ max: 40 }).withMessage("El artista/banda debe tener 40 caracteres como máximo"),
    check("creadoPor")
        .escape()
        .notEmpty().withMessage("Se debe indicar el nombre de usuario que crea el descuento")
        .bail()
        .isLength({ min: 3, max: 40 }).withMessage("Nombre de usuario que lanza el descuento debe tener entre 3 y 40 caracteres"),
];