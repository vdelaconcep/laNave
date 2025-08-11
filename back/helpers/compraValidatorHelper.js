import { check } from 'express-validator';

const listaProvincias = ["Buenos Aires", "Catamarca", "Chaco", "Chubut", "Ciudad Autónoma de Buenos Aires", "Córdoba", "Corrientes", "Entre Ríos","Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego, Antártida e Islas del Atlántico Sur", "Tucumán"];

const reglasValidacionCompra = [
    check("carrito")
        .notEmpty()
        .withMessage('Debe enviarse el carrito de compras')
        .bail()
        .isArray({min: 4})
        .withMessage('El carrito debe consistir en un array con al menos 4 objetos')
        .bail()
        .custom((value) => {
            if (!Array.isArray(value)) {
                throw new Error("El carrito debe ser un array");
            }

            const noObjeto = value.some(item => typeof item !== 'object' || item === null || Array.isArray(item));
            if (noObjeto) {
                throw new Error("Dentro del carrito debe haber solo objetos JSON válidos (no null, no arrays)");
            }

            const productos = value.filter(item => item.hasOwnProperty("id") && item.hasOwnProperty("cantidad"));

            if (productos.length < 1) {
                throw new Error("Debe incluir al menos un producto con id y cantidad");
            }

            for (const producto of productos) {
                if (!producto.id || producto.id === null) throw new Error("Se debe indicar el id para cada producto");

                if (!producto.talle || typeof producto.talle !== "string" || producto.talle.trim().length === 0 || producto.talle.length > 5) throw new Error("Se debe indicar el talle para cada producto, con menos de 5 caracteres");

                if (!producto.cantidad || producto.cantidad === null || typeof producto.cantidad !== 'number' || producto.cantidad < 1) throw new Error("Se debe indicar la cantidad solicitada de cada producto con un número de 1 a 50");
            }

            const entregaObj = value.find(item => item.hasOwnProperty("entrega"));
            if (!entregaObj || typeof entregaObj.entrega !== "object" || !entregaObj.entrega.formaEntrega) {
                throw new Error("Debe incluir un objeto 'entrega' con la forma de entrega y dirección");
            }

            const entrega = entregaObj.entrega;

            if (!['local', 'moto', 'correo'].includes(entrega.formaEntrega)) throw new Error('Se debe indicar la forma de entrega del pedido')

            if (entrega.formaEntrega !== 'local') {
                if (!entrega.direccion) throw new Error('Debe indicarse la dirección para la entrega');

                if (!entrega.direccion.calle || entrega.direccion.calle.length < 1 || entrega.direccion.calle.length > 40) throw new Error('Debe indicarse la calle, con hasta 40 caracteres');

                if (!entrega.direccion.numero || typeof entrega.direccion.numero !== "number" || entrega.direccion.numero < 0 || entrega.direccion.numero > 999999) throw new Error('Debe indicarse el número para la dirección, con un valor numérico menor que 999999');

                if (entrega.direccion.pisoDto && entrega.direccion.pisoDto.length > 15) throw new Error('El campo para indicar piso y departamento debe tener como máximo 15 caracteres');

                if (!entrega.direccion.localidad || entrega.direccion.localidad.length < 1 || entrega.direccion.localidad.length > 40) throw new Error('Debe indicarse la localidad/ barrio, con hasta 40 caracteres');

                if (!entrega.direccion.departamento || entrega.direccion.departamento.length < 1 || entrega.direccion.departamento.length > 40) throw new Error('Debe indicarse el departamento /partido /comuna, con hasta 40 caracteres');

                if (entrega.formaEntrega === 'moto') {
                    if (!['Almirante Brown', 'Avellaneda', 'Berazategui', 'Esteban Echeverría', 'Ezeiza', 'Florencio Varela', 'Lanús', 'Lomas de Zamora', 'Presidente Perón', 'Quilmes'].includes(entrega.direccion.departamento)) throw new Error('El departamento /partido /comuna para la entrega en moto debe pertenecer a la zona sur del Gran Buenos Aires');
                }
                
                if (entrega.formaEntrega === 'correo') {
                    if (!listaProvincias.includes(entrega.direccion.provincia)) throw new Error('Debe indicar una provincia argentina válida');

                    if (!entrega.direccion.cp || entrega.direccion.cp.length < 4 || entrega.direccion.cp.length > 8) throw new Error('Debe indicar el código postal, de entre 4 y 8 caracteres');
                }

            }

            const modoPago = value.find(item => item.hasOwnProperty("modoPago"));

            if (!modoPago || !modoPago.modoPago) {
                throw new Error("Se debe indicar el modo de pago");
            }

            if (!['transferencia', 'conTarjeta'].includes(modoPago.modoPago)) throw new Error("El modo de pago debe ser 'transferencia' o 'conTarjeta'"); 

            const usuario = value.find(item => item.hasOwnProperty("usuario"));

            if (!usuario) {
                throw new Error("Debe incluir un objeto 'usuario' con un email válido");
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.usuario)) {
                throw new Error("El campo 'usuario' debe contener un email válido");
            }
            return true;
        })
];

export { reglasValidacionCompra };