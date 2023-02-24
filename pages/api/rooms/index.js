import { dbConnect } from "@/utils/dbConnect";
import Room from "@/models/Room";
import Category from "@/models/Category";
import Joi from "joi";
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


const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    return res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const saveRoom = async (req, res) => {
  try {
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
      return res.status(400).json({ message: error.details[0].message });
    }
    const { nombre, precio, descripcion, imagen, stock, categoria } = req.body;
    let existRoom = await Room.findOne({ nombre });
    if (existRoom) {
      return res
        .status(409)
        .json({ message: `La habitación con nombre "${nombre}" ya existe` });
    }
    const categoryInDb = await Category.findOne({ nombre: categoria });
    if (!categoryInDb) {
      return res.status(409).json({
        message: `la categoria ${categoria} no existe, favor de crearla`,
      });
    }
    await Room.create(
      {
        nombre,
        precio,
        descripcion,
        imagen,
        stock,
        categoria: categoryInDb._id,
      },
      async (err, room) => {
        if (err) {
          console.error(error);
          return res.status(500).send({ message: "Error del servidor" });
        }
        return res.status(200).json({
          id: room._id,
          nombre: room.nombre,
          precio: room.precio,
          descripcion: room.descripcion,
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
