import mongoose from "mongoose";

const ClinicSchema = new mongoose.Schema(
  {
    clinicId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
  },
  { timestamps: true },
);

export default mongoose.models.Clinic || mongoose.model("Clinic", ClinicSchema);
