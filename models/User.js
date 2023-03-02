import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de usuario es requerido"],
      trim: true,
      maxlength: [
        20,
        "El nombre de usuario debería ser menor de 20 caracteres",
      ],
    },
    correo: {
      type: String,
      required: [true, "El correo electrónico es requerido"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "El correo electrónico no es válido"],
    },
    contraseña: {
      type: String,
      required: [true, "La contraseña es requerida"],
      trim: true,
      minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
    },
    habitacionesReservadas: [
      {
        reservacionId: { type: Schema.Types.ObjectId, ref: "Reservation" },
        habitacionId: { type: Schema.Types.ObjectId, ref: "Room" },
      },
    ],
    isAdmin: {
      default: false,
      type: Boolean,
    },
  },
  { timestamps: true, versionKey: false }
);

export default models?.User || model("User", userSchema);


