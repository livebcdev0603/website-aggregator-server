import express from "express";

import { getData } from "../controller/ChatGPTController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

router.post("/url", getData);

export default router;
