import request from "supertest";
import app from "../app"; // Assuming you have an Express app instance in 'app.js'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel";
import appointmentModel from "../models/appointmentModel";
import doctorModel from "../models/doctorModel";
import { v2 as cloudinary } from "cloudinary";
import stripe from "stripe";
import razorpay from "razorpay";

// Mock external libraries
jest.mock("../models/userModel");
jest.mock("../models/doctorModel");
jest.mock("../models/appointmentModel");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");
jest.mock("cloudinary");
jest.mock("stripe");
jest.mock("razorpay");

describe("User API Tests", () => {
  describe("Register User", () => {
    it("should register a new user and return a token", async () => {
      const mockUser = {
        _id: "123",
        email: "test@test.com",
        password: "hashedpassword",
      };
      const mockToken = "mockedToken";

      bcrypt.hash.mockResolvedValue("hashedpassword");
      jwt.sign.mockReturnValue(mockToken);
      userModel.prototype.save.mockResolvedValue(mockUser);

      const response = await request(app).post("/api/register").send({
        name: "Test User",
        email: "test@test.com",
        password: "password123",
      });

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBe(mockToken);
    });

    it("should return error for missing user details", async () => {
      const response = await request(app)
        .post("/api/register")
        .send({ email: "test@test.com", password: "password123" });

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Missing Details");
    });

    it("should return error for invalid email", async () => {
      const response = await request(app).post("/api/register").send({
        name: "Test User",
        email: "invalidEmail",
        password: "password123",
      });

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Please enter a valid email");
    });
  });

  describe("Login User", () => {
    it("should login a user with valid credentials", async () => {
      const mockUser = {
        _id: "123",
        email: "test@test.com",
        password: "hashedpassword",
      };
      const mockToken = "mockedToken";

      userModel.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      const response = await request(app)
        .post("/api/login")
        .send({ email: "test@test.com", password: "password123" });

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBe(mockToken);
    });

    it("should return error for invalid credentials", async () => {
      userModel.findOne.mockResolvedValue({ password: "wrongpassword" });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post("/api/login")
        .send({ email: "test@test.com", password: "invalidpassword" });

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return error for non-existent user", async () => {
      userModel.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/login")
        .send({ email: "unknown@test.com", password: "password123" });

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User does not exist");
    });
  });

  describe("Get Profile", () => {
    it("should return user profile data without password", async () => {
      const mockUser = {
        _id: "123",
        name: "Test User",
        email: "test@test.com",
        password: "hashedpassword",
      };

      userModel.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/profile")
        .send({ userId: "123" });

      expect(response.body.success).toBe(true);
      expect(response.body.userData.email).toBe(mockUser.email);
      expect(response.body.userData.password).toBeUndefined();
    });

    it("should return error if user not found", async () => {
      userModel.findById.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/profile")
        .send({ userId: "123" });

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User not found");
    });
  });
});
