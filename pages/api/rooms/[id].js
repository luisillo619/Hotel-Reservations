import { dbConnect } from "@/utils/dbConnect";
import Joi from "joi";
import Room from "@/models/Room";
import Category from "@/models/Category";
dbConnect();

export default async function handlerRoomId(req, res) {
  try {
    switch (req.method) {
      case "PUT":
        return await updateRoom(req, res);
      case "DELETE":
        return await deleteRoom(req, res);

      default:
        return res.status(405).json({ message: "Método no permitido" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
}

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.query; // obtener el id de la sala a eliminar desde la URL
    const { error } = Joi.object({
      id: Joi.string().required(),
    }).validate({ id });

    if (error) {
      return res.status(400).json({ message: "Id no valido" });
    }

    const deletedRoom = await Room.findByIdAndDelete(id); // eliminar la sala de la base de datos
    if (!deletedRoom) {
      return res.status(404).json({ message: "Sala no encontrada" });
    }

    return res.status(204).end(); // retornar una respuesta sin contenido
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.query; // obtener el id de la sala a actualizar desde la URL
    const { nombre, precio, descripcion, imagen, stock, categoria } = req.body; // obtener los nuevos datos de la sala desde el cuerpo de la solicitud
    const categoryInDb = await Category.findOne({ nombre: categoria });
    if (!categoryInDb) {
      return res.status(409).json({
        message: `la categoria ${categoria} no existe, favor de crearla`,
      });
    }
    const { error } = Joi.object({
      nombre: Joi.string().required().max(50),
      precio: Joi.number().required().max(99999),
      descripcion: Joi.string().required(),
      imagen: Joi.string().required(),
      stock: Joi.number().required().min(0),
      categoria: Joi.string().required(),
    }).validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      {
        nombre,
        precio,
        descripcion,
        imagen,
        stock,
        categoria: categoryInDb._id,
      },
      { new: true }
    ); // actualizar la sala en la base de datos
    if (!updatedRoom) {
      return res.status(404).json({ message: "Sala no encontrada" });
    }

    return res.status(200).json({ room: updatedRoom }); // retornar la sala actualizada
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
