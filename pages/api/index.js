import { dbConnect } from "@/utils/dbConnect";
import Room from "../../models/Room";
import rooms from "@/additionals/rooms";
import Category from "@/models/Category";
import categories from "@/additionals/categories";
import mongoose from "mongoose";
dbConnect();

export default async function load(req, res) {
  try {
    await loadCategories();
    await loadRooms();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error del servidor" });
  } finally {
    return res.redirect("/");
  }
}

const loadCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log("Categorías cargadas anteriormente");
      return;
    }
    console.log("Cargando categorías en MongoDB Atlas...");
    await Category.insertMany(categories);
    console.log("Categorías cargadas correctamente");
  } catch (error) {
    console.log(`Error al cargar categorías: ${error}`);
    throw error;
  }
};

const loadRooms = async () => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const count = await Room.countDocuments();
    if (count > 0) {
      console.log("Habitaciones cargadas anteriormente");
      return;
    }
    console.log("Cargando habitaciones en MongoDB Atlas...");
    const roomCategories = await Promise.all(
      rooms.map(async (e) => {
        return await Category.findOne({ nombre: e.categoria });
      })
    );
    rooms.forEach((room, index) => {
      room.categoria = roomCategories[index]._id;
    });
    await Room.insertMany(rooms);
    console.log("Habitaciones cargadas correctamente");
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.log(`Error al cargar habitaciones: ${error}`);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
