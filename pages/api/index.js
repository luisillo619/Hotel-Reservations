import { dbConnect } from "@/utils/dbConnect";
import Room from "@/models/Room";
import rooms from "@/additionals/rooms";
import Category from "@/models/Category";
import categories from "@/additionals/categories";
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
  const count = await Category.countDocuments();
  if (count > 0) {
    console.log("categorias cargadas anteriormente");
    return;
  }
  console.log("categorias en mongo Atlas");
  await Category.insertMany(categories);
};

const loadRooms = async () => {
  const count = await Room.countDocuments();
  if (count > 0) {
    console.log("habitaciones cargadas anteriormente");
    return;
  }
  const roomsCategories = await rooms.map(async (e) => {
    return await Category.findOne({ nombre: e.categoria });
  });
  const categoryData = await Promise.all(roomsCategories);

  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].categoria === categoryData[i].nombre) {
      rooms[i].categoria = categoryData[i]._id;
    }
  }
  await Room.insertMany(rooms);
  console.log("habitaciones en mongo Atlas");
};
