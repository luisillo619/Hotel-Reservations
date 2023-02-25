import { dbConnect } from "@/utils/dbConnect";
import User from "@/models/User";
import Joi from "joi";
dbConnect();

export default async function handlerUsers(req, res) {
try {
switch (req.method) {
case "GET":
return await getUsers(req, res);
case "POST":
return await saveUser(req, res);
default:
return res.status(405).json({ message: "Error" });
}
} catch (error) {
console.error(error);
return res.status(500).json({ message: "Error del servidor" });
}
}

const getUsers = async (req, res) => {
try {
const users = await User.find({});
return res.status(200).json(users);
} catch (error) {
console.error(error);
return res.status(500).json({ message: "Error del servidor" });
}
};

const saveUser = async (req, res) => {
try {
const schema = Joi.object({
nombre: Joi.string().required().max(50),
correo: Joi.string().email().required(),
contraseña: Joi.string().required(),
reservedRooms: Joi.array().items(Joi.object())
});
const { error } = schema.validate(req.body);
if (error) {
return res.status(400).json({ message: error.details[0].message });
}
const { nombre, correo, contraseña, reservedRooms } = req.body;
let existUser = await User.findOne({ correo });
if (existUser) {
return res
.status(409)
.json({ message: `El usuario con correo ${correo} ya existe` });
}
await User.create(
{
nombre,
correo,
contraseña,
reservedRooms,
},
async (err, user) => {
if (err) {
console.error(error);
return res.status(500).send({ message: "Error del servidor" });
}
return res.status(200).json({
id: user._id,
nombre: user.nombre,
correo: user.correo,
reservedRooms: user.reservedRooms,
});
}
);
} catch (error) {
console.error(error);
return res.status(500).json({ message: "Error del servidor" });
}
};