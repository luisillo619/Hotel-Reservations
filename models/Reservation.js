const { Schema, model } = require("mongoose");

const reservationSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reservationDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default models?.Reservation || model("Reservation", reservationSchema);