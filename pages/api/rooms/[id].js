import { dbConnect } from "@/utils/dbConnect";
import Joi from "joi";
import mongoose from "mongoose";
import Room from "@/models/Room";
import Category from "@/models/Category";

// Conexión a la base de datos
dbConnect();

// Función manejadora de la ruta /api/rooms/[id]
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

// Función para eliminar una habitacion por su id
const deleteRoom = async (req, res) => {
  const session = await mongoose.startSession();
  const { id } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Id inválido" });
    }

    await session.withTransaction(async (session) => {
      const deletedRoom = await Room.findByIdAndDelete(id).session(session);

      if (!deletedRoom) {
        res.status(404).json({ message: "Habitacion no encontrada" });
      }

      return res.status(204).end();
    });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    const message =
      error.message || "Ocurrió un error al eliminar la habitación";
    return res.status(status).json({ message });
  } finally {
    await session.endSession();
  }
};

// Función para actualizar una habitacion por su id
const updateRoom = async (req, res) => {
  const { id } = req.query;
  const { nombre, precio, descripcion, imagen, stock, categoria } = req.body;
  const session = await mongoose.startSession();
  try {
    const categoryInDb = await Category.findOne({ nombre: categoria });
    if (!categoryInDb) {
      res.status(409).json({
        message: `La categoría ${categoria} no existe, favor de crearla`,
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
      res.status(400).json({
        message: error.details[0].message,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        message: "Id invalido",
      });
    }

    await session.withTransaction(async (session) => {
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
        { new: true, session }
      ).session(session);

      if (!updatedRoom) {
        res.status(404).json({
          message: "Sala no encontrada",
        });
      }

      return res.status(200).json(updatedRoom);
    });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    const message =
      error.message || "Ocurrió un error al eliminar la habitación";
    return res.status(status).json({ message });
  } finally {
    await session.endSession();
  }
};
