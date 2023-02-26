import { dbConnect } from "@/utils/dbConnect";
import User from "@/models/User";
import Joi from "joi";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

dbConnect();

export default async function handlerUsers(req, res) {
  try {
    switch (req.method) {
      case "GET":
        return await getUsers(req, res);
      case "POST":
        return await saveUser(req, res);
      default:
        return res.status(405).json({ message: "Método no permitido" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
}

const getUsers = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async (session) => {
      const users = await User.find({}).session(session);
      return res.status(200).json(users);
    });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    const message = error.message || "Ocurrió un error al obtener los usuarios";
    return res.status(status).json({ message });
  } finally {
    await session.endSession();
  }
};

const saveUser = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async (session) => {
      const { error } = Joi.object({
        nombre: Joi.string().required().max(50),
        correo: Joi.string().email().required(),
        contraseña: Joi.string().required(),
      }).validate(req.body);

      if (error) {
        return res
          .status(400)
          .json({ message: "Los datos ingresados no son válidos" });
      }

      const { nombre, correo, contraseña } = req.body;

      let existUser = await User.findOne({ correo }).session(session);

      if (existUser) {
        return res
          .status(409)
          .json({ message: `El usuario con correo ${correo} ya existe` });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(contraseña, salt);

      const [createdUser] = await User.create(
        [
          {
            nombre,
            correo,
            contraseña: passwordHash,
          },
        ],
        { session }
      );

      res.status(200).json({
        id: createdUser._id,
        nombre: createdUser.nombre,
        correo: createdUser.correo,
      });
    });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    const message = error.message || "Ocurrió un error al crear al usuario";
    return res.status(status).json({ message });
  } finally {
    await session.endSession();
  }
};
