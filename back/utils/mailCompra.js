import fs from 'fs';
import mjml2html from 'mjml';
import transporter from '../config/nodemailer.js';

export const enviarMailCompra = async (compra) => {
    let plantilla = fs.readFileSync('./plantillaCompra.mjml', 'utf8');
    plantilla = plantilla.replace('{{total}}', compra.total).replace('{{entrega}}', compra.entrega).replace('{{pago}}', compra.pago);
    const filas = compra.productos.map(p => `
        <tr>
        <td align="center"><img src="${p.imagen}" width="50" style="vertical-align: middle; margin-right: 10px;" />
        <td align="center">${p.nombre} (talle ${p.talle})</td>
        <td align="center">${p.cantidad}</td>
        <td align="center" style="mso-number-format:'\@';">$${p.totalProducto}</td>
        </tr>
        `).join('');
    
    plantilla = plantilla.replace(/{{#each productos}}([\s\S]*?){{\/each}}/, filas);

    const { html } = mjml2html(plantilla);

    await transporter.sendMail({
        from: 'La nave Rockería',
        to: compra.email,
        subject: '¡Gracias por tu compra!',
        html
    });
};