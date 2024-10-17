// config/appFactory.js
import express from "express";
import cors from "cors";

const createApp = () => {
  const app = express();

  // middlewares
  app.use(express.json());
  app.use(cors());

  return app;
};

export default createApp;
