import request from "supertest";
import app from "../app"; // Assuming your Express app is exported from this file
import Hospital from "../models/hospitalModel";

// Mock the Hospital model
jest.mock("../models/hospitalModel");

describe("Hospital API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test for getAllHospitals API
  describe("GET /api/hospitals", () => {
    it("should return all hospitals", async () => {
      const hospitals = [
        { name: "Hospital A", type: "General", totalDoctors: 100 },
        { name: "Hospital B", type: "Specialized", totalDoctors: 50 },
      ];

      // Mock Hospital.find to return the list of hospitals
      Hospital.find.mockResolvedValue(hospitals);

      const res = await request(app).get("/api/hospitals");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.hospitals).toEqual(hospitals);
    });

    it("should return a server error if something goes wrong", async () => {
      Hospital.find.mockRejectedValue(new Error("Database error"));

      const res = await request(app).get("/api/hospitals");

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Server error");
    });
  });

  // Test for getHospitalById API
  describe("GET /api/hospitals/:id", () => {
    it("should return a single hospital by ID", async () => {
      const hospital = {
        _id: "hospitalId123",
        name: "Hospital A",
        type: "General",
        totalDoctors: 100,
        address: "123 Main St",
      };

      // Mock Hospital.findById to return a hospital
      Hospital.findById.mockResolvedValue(hospital);

      const res = await request(app).get("/api/hospitals/hospitalId123");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.hospital).toEqual(hospital);
    });

    it("should return a 404 if the hospital is not found", async () => {
      // Mock Hospital.findById to return null
      Hospital.findById.mockResolvedValue(null);

      const res = await request(app).get("/api/hospitals/nonexistentId");

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Hospital not found");
    });

    it("should return a server error if something goes wrong", async () => {
      Hospital.findById.mockRejectedValue(new Error("Database error"));

      const res = await request(app).get("/api/hospitals/hospitalId123");

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Server error");
    });
  });

  // Test for createHospital API
  describe("POST /api/hospitals", () => {
    it("should create a new hospital", async () => {
      const newHospital = {
        name: "New Hospital",
        type: "General",
        image: "hospital.jpg",
        totalDoctors: 150,
        address: "456 New St",
      };

      // Mock the save method to resolve successfully
      Hospital.prototype.save = jest.fn().mockResolvedValue(newHospital);

      const res = await request(app).post("/api/hospitals").send(newHospital);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.hospital).toEqual(newHospital);
    });

    it("should return a 400 if required fields are missing", async () => {
      const incompleteHospitalData = {
        name: "New Hospital",
        type: "General",
        // Missing image, totalDoctors, and address
      };

      const res = await request(app)
        .post("/api/hospitals")
        .send(incompleteHospitalData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("All fields are required");
    });

    it("should return a server error if something goes wrong", async () => {
      const hospitalData = {
        name: "New Hospital",
        type: "General",
        image: "hospital.jpg",
        totalDoctors: 150,
        address: "456 New St",
      };

      // Mock the save method to throw an error
      Hospital.prototype.save = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      const res = await request(app).post("/api/hospitals").send(hospitalData);

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Server error");
    });
  });

  // Test for updateHospital API
  describe("PUT /api/hospitals/:id", () => {
    it("should update a hospital by ID", async () => {
      const existingHospital = {
        _id: "hospitalId123",
        name: "Hospital A",
        type: "General",
        totalDoctors: 100,
        address: "123 Main St",
      };

      const updatedHospital = {
        _id: "hospitalId123",
        name: "Updated Hospital",
        type: "Specialized",
        totalDoctors: 200,
        address: "456 Updated St",
      };

      // Mock Hospital.findById to return the existing hospital
      Hospital.findById.mockResolvedValue(existingHospital);

      // Mock the save method to resolve successfully
      existingHospital.save = jest.fn().mockResolvedValue(updatedHospital);

      const res = await request(app)
        .put("/api/hospitals/hospitalId123")
        .send(updatedHospital);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.hospital.name).toBe("Updated Hospital");
    });

    it("should return 404 if the hospital is not found", async () => {
      Hospital.findById.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/hospitals/nonexistentId")
        .send({ name: "New Name" });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Hospital not found");
    });

    it("should return a server error if something goes wrong", async () => {
      Hospital.findById.mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .put("/api/hospitals/hospitalId123")
        .send({ name: "New Name" });

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Server error");
    });
  });

  // Test for deleteHospital API
  describe("DELETE /api/hospitals/:id", () => {
    it("should delete a hospital by ID", async () => {
      const hospital = {
        _id: "hospitalId123",
        name: "Hospital A",
      };

      // Mock Hospital.findById to return a hospital
      Hospital.findById.mockResolvedValue(hospital);

      // Mock the remove method
      hospital.remove = jest.fn().mockResolvedValue(true);

      const res = await request(app).delete("/api/hospitals/hospitalId123");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Hospital deleted successfully");
    });

    it("should return 404 if the hospital is not found", async () => {
      Hospital.findById.mockResolvedValue(null);

      const res = await request(app).delete("/api/hospitals/nonexistentId");

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Hospital not found");
    });

    it("should return a server error if something goes wrong", async () => {
      Hospital.findById.mockRejectedValue(new Error("Database error"));

      const res = await request(app).delete("/api/hospitals/hospitalId123");

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Server error");
    });
  });
});
