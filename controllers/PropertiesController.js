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

  const video = req.files.video.tempFilePath;
  const images = req.files.images;
  const avatar = req.files.avatar.tempFilePath;

  try {
    const avatarResult = await cloudinary.uploader.upload(avatar, {
      use_filename: true,
      folder: "yemsays",
    });
    // deleting temporary files path
    fs.unlinkSync(req.files.avatar.tempFilePath);

    const imageUploadPromises = images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        use_filename: true,
        folder: "yemsays",
      });
      fs.unlinkSync(image.tempFilePath);
      return result.secure_url;
    });
    const uploadedImages = await Promise.all(imageUploadPromises);

    const videoResult = await cloudinary.uploader.upload(video, {
      resource_type: "video",
      folder: "yemsaysvideos",
    });
    fs.unlinkSync(req.files.video.tempFilePath);

    const media = {
      images: [...uploadedImages],
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
    console.log(error);
    res.status(400).json(error);
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

const getSingleProperty = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const property = await Property.findById({_id: propertyId});
     res.status(200).json({ msg: "success", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLatestProperty = async (req, res) => {
  try {
    const latestProperties = await Property.find().sort("-createdAt").limit(4)
     res.status(200).json({ msg: "success", property: latestProperties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProperty,
  getProperties,
  getSingleProperty,
  getLatestProperty,
};
