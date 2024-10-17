import Hospital from "../models/hospitalModel.js";

/**Command Design Pattern  */
class CreateHospitalCommand {
  constructor(hospitalService, hospitalData) {
    this.hospitalService = hospitalService;
    this.hospitalData = hospitalData;
  }

  execute() {
    return this.hospitalService.createhospital(this.hospitalData);
  }
}
// Get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json({ success: true, hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get a single hospital by ID
export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, message: "Hospital not found" });
    }
    res.status(200).json({ success: true, hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Add a new hospital
export const createHospital = async (req, res) => {
  try {
    const { name, type, image, totalDoctors, address } = req.body;

    // Basic validation
    if (!name || !type || !image || !totalDoctors || !address) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newHospital = new Hospital({
      name,
      type,
      image,
      totalDoctors,
      address,
    });
    await newHospital.save();
    res.status(201).json({
      success: true,
      message: "Hospital created successfully",
      hospital: newHospital,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Update hospital details
export const updateHospital = async (req, res) => {
  try {
    const { name, type, image, totalDoctors, address } = req.body;
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, message: "Hospital not found" });
    }

    hospital.name = name || hospital.name;
    hospital.type = type || hospital.type;
    hospital.image = image || hospital.image;
    hospital.totalDoctors = totalDoctors || hospital.totalDoctors;
    hospital.address = address || hospital.address;

    await hospital.save();
    res.status(200).json({
      success: true,
      message: "Hospital updated successfully",
      hospital,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete a hospital
export const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res
        .status(404)
        .json({ success: false, message: "Hospital not found" });
    }

    await hospital.remove();
    res
      .status(200)
      .json({ success: true, message: "Hospital deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
