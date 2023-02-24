const { Schema, model, models } = require("mongoose");

const roomSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      unique: true,
      trim: true,
      maxlength: [50, "El deberia ser menor de 50 caracteres"],
    },
    precio: {
      type: Number,
      required: [true, "El Precio de la habitacion es requerido"],
      trim: true,
      max: [99999, "El precio debe ser menor o igual a 99999"],
      min: [0, "El precio debe ser igual o mayor a 0"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripcion es requerida"],
    },
    imagen: {
      type: String,
      required: [true, "La imagen es requerida"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es requerido"],
      min: [0, "El stock debe ser igual o mayor a 0"],
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoria es requerida"],
    },
    reservedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    //   user: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true, versionKey: false }
);

export default models?.Room || model("Room", roomSchema);
