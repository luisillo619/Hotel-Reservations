import { dbConnect } from "@/utils/dbConnect";
import Room from "@/models/Room";
import User from "@/models/User";
import Reservation from "@/models/Reservation";
import mongoose from "mongoose";

export default async function handlerReserve(req, res) {
  await dbConnect();
  try {
    switch (req.method) {
      case "POST":
        return await reserveRoom(req, res);
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
  const { userId, roomId, reserveId } = req.query;
  const session = await mongoose.startSession();
  try {
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    if (![userId, roomId, reserveId].every(isValidObjectId)) {
      return res.status(400).json({
        message: "Id de usuario, habitación o reserva inválido",
      });
    }

    await session.withTransaction(async (session) => {
      const [user, reservation, room] = await Promise.all([
        User.findById(userId).session(session),
        Reservation.findById(reserveId).session(session),
        Room.findById(roomId).session(session),
      ]);

      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      if (!reservation) {
        return res.status(404).json({
          message: "Reservación no encontrada",
        });
      }

      if (!room) {
        return res.status(404).json({
          message: "Habitación no encontrada",
        });
      }

      const reservationTime = new Date(reservation.fechaDeReserva).getTime();
      const currentTime = Date.now();

      if (currentTime - reservationTime > 86400000) {
        return res.status(400).json({
          message: "No se puede cancelar la reserva después de 24 horas",
        });
      }

      if (reservation.usuarioId.toString() !== userId) {
        return res.status(401).json({
          message: "No está autorizado para cancelar esta reserva",
        });
      }

      if (reservation.estado === "cancelada") {
        return res.status(400).json({
          message: "Esta reserva ya ha sido cancelada",
        });
      }

      reservation.estado = "cancelada";
      await reservation.save({ session });

      room.stock++;
      await room.save({ session });
      return res
        .status(200)
        .json({ message: "Reserva cancelada exitosamente" });
    });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    const message =
      error.message || "Ocurrió un error al cancelar la reservacion";
    return res.status(status).json({ message });
  } finally {
    await session.endSession();
  }
};

const reserveRoom = async (req, res) => {
  const { userId, roomId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "El identificador del usuario es inválido",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({
      message: "El identificador de la habitación es inválido",
    });
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async (session) => {
      const [user, room] = await Promise.all([
        User.findById(userId).session(session),
        Room.findById(roomId).session(session),
      ]);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (!room) {
        return res.status(404).json({ message: "Habitación no encontrada" });
      }

      if (room.stock < 1) {
        return res
          .status(409)
          .json({ message: "Habitación no disponible en este momento" });
      }

      const reservation = await Reservation.create(
        [
          {
            usuarioId: user._id,
            habitacionId: room._id,
          },
        ],
        { session }
      );

      user.habitacionesReservadas.push({
        habitacionId: room._id,
        reservacionId: reservation._id,
      });

      await user.save({ session });

      room.usuariosReservados.push({
        usuarioId: user._id,
        reservacionId: reservation._id,
      });

      room.stock -= 1;

      await room.save({ session });

      return res.status(201).json({
        message: "Habitación reservada con éxito",
        reservation,
      });
    });
  } catch (error) {
    const status = error.status || 500;
    const message =
      error.message || "Ocurrió un error al crear al hacer la reservacion";
    return res.status(status).json({ message });
  } finally {
    await session.endSession();
  }
};
