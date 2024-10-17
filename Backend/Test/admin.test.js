import request from "supertest";
import app from "../app"; // Assuming you are using Express and have an app.js file
import doctorModel from "../models/doctorModel";
import appointmentModel from "../models/appointmentModel";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";

jest.mock("../models/doctorModel");
jest.mock("../models/appointmentModel");
jest.mock("../models/userModel");
jest.mock("jsonwebtoken");

describe("Admin API Endpoints", () => {
  describe("POST /api/admin/login", () => {
    it("should login admin with valid credentials", async () => {
      process.env.ADMIN_EMAIL = "admin@example.com";
      process.env.ADMIN_PASSWORD = "admin123";
      process.env.JWT_SECRET = "testSecret";

      const response = await request(app).post("/api/admin/login").send({
        email: "admin@example.com",
        password: "admin123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(jwt.sign).toHaveBeenCalledWith(
        "admin@example.comadmin123",
        process.env.JWT_SECRET
      );
    });

    it("should not login admin with invalid credentials", async () => {
      process.env.ADMIN_EMAIL = "admin@example.com";
      process.env.ADMIN_PASSWORD = "admin123";

      const response = await request(app).post("/api/admin/login").send({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("GET /api/admin/appointments", () => {
    it("should get all appointments", async () => {
      const mockAppointments = [{ _id: "1", cancelled: false }];
      appointmentModel.find.mockResolvedValue(mockAppointments);

      const response = await request(app).get("/api/admin/appointments");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.appointments).toEqual(mockAppointments);
    });

    it("should handle error while fetching appointments", async () => {
      appointmentModel.find.mockRejectedValue(new Error("Error fetching"));

      const response = await request(app).get("/api/admin/appointments");

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Error fetching");
    });
  });

  describe("POST /api/admin/appointment/cancel", () => {
    it("should cancel an appointment", async () => {
      const appointmentId = "1";
      appointmentModel.findByIdAndUpdate.mockResolvedValue(true);

      const response = await request(app)
        .post("/api/admin/appointment/cancel")
        .send({ appointmentId });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Appointment Cancelled");
    });

    it("should handle error while cancelling appointment", async () => {
      appointmentModel.findByIdAndUpdate.mockRejectedValue(
        new Error("Cancel error")
      );

      const response = await request(app)
        .post("/api/admin/appointment/cancel")
        .send({ appointmentId: "1" });

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Cancel error");
    });
  });

  describe("POST /api/admin/doctor/add", () => {
    it("should add a doctor", async () => {
      const mockDoctor = {
        name: "Doctor Name",
        email: "doctor@example.com",
        speciality: "Cardiology",
        degree: "MD",
        experience: "5 years",
        about: "Experienced doctor",
        fees: "500",
        address: "123 Street",
        hospital: "XYZ Hospital",
      };

      const response = await request(app)
        .post("/api/admin/doctor/add")
        .send(mockDoctor);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Doctor Added");
    });

    it("should handle missing details", async () => {
      const response = await request(app).post("/api/admin/doctor/add").send({
        name: "Doctor Name",
        email: "",
        speciality: "Cardiology",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Missing Details");
    });
  });

  describe("GET /api/admin/doctors", () => {
    it("should get all doctors", async () => {
      const mockDoctors = [{ _id: "1", name: "Doctor 1" }];
      doctorModel.find.mockResolvedValue(mockDoctors);

      const response = await request(app).get("/api/admin/doctors");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.doctors).toEqual(mockDoctors);
    });

    it("should handle error while fetching doctors", async () => {
      doctorModel.find.mockRejectedValue(new Error("Error fetching doctors"));

      const response = await request(app).get("/api/admin/doctors");

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Error fetching doctors");
    });
  });
});
