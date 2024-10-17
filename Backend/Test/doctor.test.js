import request from "supertest";
import app from "../app"; // Assuming you have an express app file
import doctorModel from "../models/doctorModel";
import appointmentModel from "../models/appointmentModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mocking the doctor model and appointment model
jest.mock("../models/doctorModel");
jest.mock("../models/appointmentModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Doctor API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test loginDoctor API
  describe("POST /api/doctor/login", () => {
    it("should login the doctor and return a token if credentials are valid", async () => {
      const user = {
        _id: "doctor123",
        email: "doctor@example.com",
        password: "hashedpassword",
      };

      // Mocking the doctorModel.findOne method
      doctorModel.findOne.mockResolvedValue(user);

      // Mocking bcrypt.compare to return true
      bcrypt.compare.mockResolvedValue(true);

      // Mocking JWT token creation
      jwt.sign.mockReturnValue("testtoken");

      const res = await request(app)
        .post("/api/doctor/login")
        .send({ email: "doctor@example.com", password: "password" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBe("testtoken");
    });

    it("should return an error if credentials are invalid", async () => {
      // Mocking doctorModel.findOne to return null (user not found)
      doctorModel.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/doctor/login")
        .send({ email: "wrong@example.com", password: "wrongpassword" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  // Test appointmentsDoctor API
  describe("POST /api/doctor/appointments", () => {
    it("should return appointments for the doctor", async () => {
      const appointments = [
        { docId: "doctor123", patientName: "Patient 1", amount: 100 },
        { docId: "doctor123", patientName: "Patient 2", amount: 200 },
      ];

      // Mocking the appointmentModel.find method
      appointmentModel.find.mockResolvedValue(appointments);

      const res = await request(app)
        .post("/api/doctor/appointments")
        .send({ docId: "doctor123" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.appointments).toEqual(appointments);
    });

    it("should return an error if there is an issue retrieving appointments", async () => {
      // Mocking appointmentModel.find to throw an error
      appointmentModel.find.mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .post("/api/doctor/appointments")
        .send({ docId: "doctor123" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Database error");
    });
  });

  // Test doctorList API
  describe("GET /api/doctor/list", () => {
    it("should return a list of doctors", async () => {
      const doctors = [
        { name: "Doctor 1", specialty: "Cardiology" },
        { name: "Doctor 2", specialty: "Neurology" },
      ];

      // Mocking the doctorModel.find method
      doctorModel.find.mockResolvedValue(doctors);

      const res = await request(app).get("/api/doctor/list");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.doctors).toEqual(doctors);
    });

    it("should return an error if there is an issue retrieving doctors", async () => {
      // Mocking doctorModel.find to throw an error
      doctorModel.find.mockRejectedValue(new Error("Database error"));

      const res = await request(app).get("/api/doctor/list");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Database error");
    });
  });
});
