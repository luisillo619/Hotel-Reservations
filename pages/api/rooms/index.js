import { dbConnect } from "@/utils/dbConnect";
import Room from "@/models/Room";
import Category from "@/models/Category";
import Joi from "joi";
import mongoose from "mongoose";
dbConnect();

export default async function handlerRooms(req, res) {
  try {
    switch (req.method) {
      case "GET":
        return await getRooms(req, res);
      case "POST":
        return await saveRoom(req, res);
      default:
        return res.status(405).json({ message: "Método no permitido" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
}

// dividir por catergoria
const getRooms = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async (session) => {
      const rooms = await Room.find({}).session(session);
      return res.status(200).json(rooms);
    });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    const message = error.message || 'Error al obtener habitaciones';
    return res.status(status).json({ message });
  } finally {
    await session.endSession();
  }
};

async function saveRoom(req, res) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async (session) => {
      const schema = Joi.object({
        nombre: Joi.string().required().max(50),
        precio: Joi.number().required().max(99999),
        descripcion: Joi.string().required(),
        imagen: Joi.string().required(),
        stock: Joi.number().required().min(0),
        categoria: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res
          .status(400)
          .json({ message: "Los datos ingresados no son válidos" });
      }
      const { nombre, precio, descripcion, imagen, stock, categoria } =
        req.body;
      const categoryInDb = await Category.findOne({
        nombre: categoria,
      }).session(session);

      if (!categoryInDb) {
        return res.status(404).json({ message: "La categoría no existe" });
      }
      const existRoom = await Room.findOne({ nombre }).session(session);
      if (existRoom) {
        return res
          .status(409)
          .json({ message: "Ya existe una habitación con este nombre" });
      }
      const [room] = await Room.create(
        [
          {
            nombre,
            precio,
            descripcion,
            imagen,
            stock,
            categoria: categoryInDb._id,
          },
        ],
        { session }
      );
      return res.status(200).json({
        id: room._id,
        nombre: room.nombre,
        precio: room.precio,
        descripcion: room.descripcion,
      });
    });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    const message = error.message || "Ocurrió un error al crear la habitacion";
    return res.status(status).json({ message });
  } finally {
    await session.endSession();
  }
}
