import { Schema, model, models } from "mongoose";

const categorySchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      unique: true,
      trim: true,
      maxlength: [20, "El deberia ser menor de 20 caracteres"],
    },
  },
  { timestamps: true, versionKey: false }
);

export default models?.Category || model("Category", categorySchema);
