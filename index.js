import express from "express";
import cors from "cors";

import router from "./routes/index.js";

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
  })
);

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
