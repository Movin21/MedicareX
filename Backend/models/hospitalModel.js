import mongoose from "mongoose";

const { Schema } = mongoose;

const hospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["General", "Pediatric", "Specialty", "Clinic"],
    },
    image: {
      type: String,
      required: true,
    },
    totalDoctors: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
