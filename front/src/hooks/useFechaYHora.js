const useFechaYHora = (utc) => {
    const fecha = new Date(utc);
    return new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Argentina/Buenos_Aires'
    }).format(fecha);
};

export default useFechaYHora;