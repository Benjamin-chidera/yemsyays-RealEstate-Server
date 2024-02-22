const Property = require("../models/Properties");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const createProperty = async (req, res) => {
  const {
    title,
    location,
    price,
    propertyType,
    description,
    tags,
    propertyStatus,
    bedroom,
    bathroom,
    garage,
    squareFeet,
    name,
    phoneNumber,
    whatsappNumber,
  } = req.body;
  const { video, images, avatar } = req.files;
  try {
    // Validate if req.files and req.files.images exist
    if (!video || !images || !avatar) {
      return res.status(400).json({ error: "Missing files" });
    }

    // Uploading avatar image
    const avatarResult = await cloudinary.uploader.upload(avatar.tempFilePath, {
      use_filename: true,
      folder: "yemsays",
    });
    fs.unlinkSync(avatar.tempFilePath);

    // Uploading images
    const imageUploadPromises = images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        use_filename: true,
        folder: "yemsays",
      });
      fs.unlinkSync(image.tempFilePath);
      return result.secure_url;
    });
    const uploadedImages = await Promise.all(imageUploadPromises);

    // Uploading video
    const videoResult = await cloudinary.uploader.upload(video.tempFilePath, {
      resource_type: "video",
      folder: "yemsaysvideos",
    });
    fs.unlinkSync(video.tempFilePath);

    const media = {
      images: uploadedImages,
      video: videoResult.secure_url,
    };

    const salesSupport = {
      name,
      phoneNumber,
      whatsappNumber,
      avatar: avatarResult.secure_url,
    };

    const property = await Property.create({
      title,
      location,
      price,
      propertyType,
      description,
      tags,
      propertyStatus,
      bedroom,
      bathroom,
      garage,
      squareFeet,
      media,
      salesSupport,
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({ msg: "success", properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProperty,
  getProperties,
};
