import express from "express";
import {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
} from "../controllers/hospitalController.js";
const HospitalRouter = express.Router();

// Route to get all hospitals
HospitalRouter.get("/", getAllHospitals);

// Route to get a single hospital by its ID
HospitalRouter.get("/:id", getHospitalById);

// Route to create a new hospital
HospitalRouter.post("/", createHospital);

// Route to update an existing hospital
HospitalRouter.put("/:id", updateHospital);

// Route to delete a hospital
HospitalRouter.delete("/:id", deleteHospital);

export default HospitalRouter;
