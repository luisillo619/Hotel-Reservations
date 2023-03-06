import { Schema, model, models } from "mongoose";

const reservationSchema = new Schema(
  {
    habitacionId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fechaDeReserva: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada'],
      default: 'pendiente',
    }
  },
  { versionKey: false }
);

export default models?.Reservation || model("Reservation", reservationSchema);
