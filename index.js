require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const inspectionRouter = require("./routers/inspectionRouter");
const propertyRouter = require("./routers/PropertiesRouter");
const reviewRouter = require("./routers/reviewRouter");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const authRouter = require("./routers/authRouter");
const contactRouter = require("./routers/contactRouter");

const app = express();
const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use("/api/v1/inspection", inspectionRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/contact", contactRouter);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "This is the home page" });
});

app.use((req, res) => {
  res.status(404).json({ err: "404 Not Found" });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO, { dbName: "yemsays" });

    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

start();
