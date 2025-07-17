import { check } from 'express-validator';

const reglasValidacionAlta = [
    check("banda")
        .trim()
        .escape()
        .notEmpty().withMessage("Debe indicar el nombre del artista/ banda")
        .bail()
        .isLength({ max: 40 }).withMessage("El nombre del artista/ banda no debe superar los 40 caracteres"),
    
    check("tipo")
        .trim()
        .escape()
        .notEmpty().withMessage("Debe indicar el tipo de producto")
        .bail()
        .isLength({max: 20}).withMessage("El tipo de producto no debe tener más de 20 caracteres"),

    check("stock")
        .notEmpty().withMessage("Debe ingresar el stock disponible")
        .bail()
        .custom((value) => {
            let parseado;
            try {
                parseado = JSON.parse(value);
            } catch (error) {
                throw new Error("El stock debe ser un JSON válido");
            }

            const clavesStock = Object.keys(parseado);

            if (clavesStock.length === 0) {
                throw new Error("Se debe indicar al menos un talle o stock único");
            }

            for (const clave of clavesStock) {
                let cantidad = parseado[clave];
                
                cantidad = Number(cantidad);
                
                if(isNaN(cantidad)) throw new Error(`El stock para "${clave}" debe ser un número entero`);
                
                if (cantidad < 0 || !Number.isInteger(cantidad)) {
                    throw new Error(`El stock para "${clave}" debe ser un número entero mayor o igual a cero`);
                }
            }
            
            return true;
        }),

    check("precio")
        .notEmpty().withMessage("Debe ingresar un precio")
        .bail()
        .isInt({ min: 1 }).withMessage("El precio ingresado debe ser mayor que 0"),
    
    check("descuento")
        .notEmpty().withMessage("Debe ingresar un descuento (o '0')")
        .bail()
        .isInt({ min: 0, max: 100 }).withMessage("El descuento debe ser un porcentaje entre 0 y 100"),

    check("imagen")
        .optional({ checkFalsy: true })
        .custom((value, { req }) => {
            if (!req.file) {
                return true;
            };

            if (req.file.mimetype !== ("image/jpeg") && req.file.mimetype !== ("image/png")) {
                throw new Error("Debe subir una imagen en formato .jpg, .jpeg o .png");
            };

            if (req.file.size > 2 * 1024 * 1024) {
                throw new Error("La imagen no debe superar 2 Mb");
            };

            return true;
        }),
    
    check("destacado")
        .notEmpty().withMessage("Debe indicar si es un producto destacado")
        .bail()
        .custom(value => {
            if (value !== "true" && value !== "false" && value !== true && value !== false) {
                throw new Error("'Destacado' debe ser true o false");
            }
            return true;
        })
];

export { reglasValidacionAlta };