import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de usuario es requerido"],
      unique: true,
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
        habitacion: { type: Schema.Types.ObjectId, ref: "Room" },
        fechaReserva: { type: Date, default: Date.now },
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

// const user = new User({
//   nombre: "John",
//   correo: "john@example.com",
//   contraseña: "password123",
//   habitacionesReservadas: [
//     { habitacion: roomId }
//   ]
// });

// await user.save();

// const user = await User.findById(userId);

// user.habitacionesReservadas.push({ habitacion: roomId });

// await user.save();
