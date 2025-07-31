import { check, body } from 'express-validator';

const alMenosUnDato = body().custom((value, { req }) => {
    const datosPermitidos = ['banda', 'tipo', 'stock', 'precio', 'descuento', 'imagen'];

    const datos = req.body || {};

    const datosPresentes = datosPermitidos.filter(dato => {
        if (dato === 'imagen') return req.file;
        return datos[dato] !== undefined && datos[dato] !== '';
    });

    if (datosPresentes.length === 0) {
        throw new Error('Debe enviar al menos un dato para modificar');
    }

    return true;
});

const reglasValidacionActualizacion = [
    alMenosUnDato,

    check("banda")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ max: 40 }).withMessage("El nombre del artista/ banda no debe superar los 40 caracteres"),
    
    check("tipo")
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({max: 30}).withMessage("El tipo de producto no debe tener más de 30 caracteres"),

    check("stock")
        .optional({ checkFalsy: true })
        .custom((value) => {
            let parseado;
            try {
                parseado = JSON.parse(value);
            } catch (error) {
                throw new Error('El stock debe ser un JSON válido');
            }

            const clavesStock = Object.keys(parseado);

            if (clavesStock.length === 0) throw new Error('Se debe indicar stock');

            if (clavesStock.includes("U") && clavesStock.length > 1) throw new Error('"U" indica talle único, por lo que no pueden especificarse otros talles')

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
        .optional({ checkFalsy: true })
        .isInt({ min: 1 }).withMessage("El precio ingresado debe ser mayor que 0"),
    
    check("descuento")
        .optional({ checkFalsy: true })
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
        })
];

export { reglasValidacionActualizacion };