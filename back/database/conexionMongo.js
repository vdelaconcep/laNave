import mongoose from 'mongoose';


// conectamos a la base de datos
const connectDB = async (MONGO_URI) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Conectado a la base de datos`);
    } catch (err) {
        console.error(`Error al conectar a la base de datos: ${err.message}`);
        process.exit(1);
    }
};

// exportamos la función de conexión a la base de datos
export default connectDB;