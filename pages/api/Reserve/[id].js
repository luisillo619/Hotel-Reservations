import { dbConnect } from "@/utils/dbConnect";
import Joi from "joi";
import Room from "@/models/Room";
import User from "@/models/User";
import Reservation from "@/models/Reservation"
dbConnect();

export default async function handlerReserve(req, res) {
  try {
    switch (req.method) {
      case "POST":
        return await reserveRoom(req, res) ;
      case "DELETE":
        return await cancelReservation(req, res);

      default:
        return res.status(405).json({ message: "Método no permitido" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
}

const cancelReservation = async (req, res) => {
  const { userId, roomId } = req.params;

  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
      roomId: Joi.string().required(),
    });
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si la habitación reservada existe en el arreglo de reservas del usuario
    const reservedRoomIndex = user.reservedRooms.findIndex(
      (room) => room.roomId === roomId
    );

    if (reservedRoomIndex === -1) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    // Obtener la información de la habitación reservada de la colección "rooms"
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    // Verificar si han pasado menos de 24 horas desde que se realizó la reserva
    const reservationTime = new Date(room.reservationDate).getTime();
    const currentTime = Date.now();

    if ((currentTime - reservationTime) > 86400000) { // 86400000 milisegundos = 24 horas
      return res.status(400).json({ message: "No se puede cancelar la reserva después de 24 horas" });
    }

    // Actualizar la información de la habitación reservada en la colección "rooms"
    room.reserved = false;
    room.reservationDate = null;
    await room.save();

    // Eliminar la habitación reservada del arreglo de reservas del usuario
    user.reservedRooms.splice(reservedRoomIndex, 1);
    await user.save();

    return res.status(200).json({ message: "Reserva cancelada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

const reserveRoom = async (req, res) => {
  const { userId, roomId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }
//REVISAR ESTE IF, POSIBLE CAMBIO POR STOCK PARA VER SI QUEDAN HABITACIONES DISPONIBLES
    if (room.reserved) {
      return res.status(400).json({ message: "Habitación ya reservada" });
    }

    // Crear una nueva reserva y guardarla en la colección "rooms"
    const reservation = new Reservation({
      userId: user._id,
      roomId: room._id,
      reservationDate: Date.now()
    });
    await reservation.save();

    // Actualizar la información de la habitación reservada en la colección "rooms"
    room.reserved = true;
    room.reservationDate = Date.now();
    await room.save();

    // Agregar la habitación reservada al arreglo de reservas del usuario
    user.reservedRooms.push({
      roomId: room._id,
      reservationDate: Date.now()
    });
    await user.save();

    return res.status(200).json({ message: "Habitación reservada exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
