const Property = require("../models/properties");
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
    bathroom,
    bedroom,
    garage,
    squareFeet,
    name,
    phoneNumber,
    whatsappNumber,
  } = req.body;

  try {
    // Upload avatar to Cloudinary
    const avatarResult = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath,
      {
        use_filename: true,
        folder: "yemsays",
      }
    );
    fs.unlinkSync(req.files.avatar.tempFilePath); // Delete temp file

    // Upload images to Cloudinary
    const imageUploadPromises = req.files.images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        use_filename: true,
        folder: "yemsays",
      });
      fs.unlinkSync(image.tempFilePath); // Delete temp file
      return result.secure_url;
    });
    const uploadedImages = await Promise.all(imageUploadPromises);

    // Upload video to Cloudinary
    const videoResult = await cloudinary.uploader.upload(
      req.files.video.tempFilePath,
      {
        resource_type: "video",
        folder: "yemsaysvideos",
      }
    );
    fs.unlinkSync(req.files.video.tempFilePath); // Delete temp file

    // Prepare media and sales support objects
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

    // Create property in the database
    const property = await Property.create({
      title,
      location,
      price,
      propertyType,
      description,
      tags,
      propertyStatus,
      bathroom,
      bedroom,
      garage,
      squareFeet,
      media,
      salesSupport,
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ success: false, error: "Failed to create property." });
  }
};

const getProperties = async (req, res) => {
  const { type, location, price } = req.query;

  const queryObj = {};

  if (type) {
    queryObj.propertyType = { $regex: type, $options: "i" };
  }

  if (location) {
    queryObj.location = { $regex: location, $options: "i" };
  }

  if (price) {
    queryObj.price = { $eq: price };
  }

  try {
    const properties = await Property.find(queryObj).sort("-createdAt");
    res.status(200).json({
      msg: "success",
      properties,
      NumOfProperties: properties.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleProperty = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const property = await Property.findById({ _id: propertyId });

    const propertyType = property.propertyType;

    const similarProperties = await Property.find({ propertyType }).limit(6);

    res.status(200).json({ msg: "success", property, similarProperties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLatestProperty = async (req, res) => {
  try {
    const latestProperty = await Property.find().sort("-createdAt").limit(4);
    res.status(200).json({ msg: "success", property: latestProperty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recentProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort("-createdAt").limit(2);
    res.status(201).json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findByIdAndDelete({ _id: propertyId });
    res
      .status(201)
      .json({ success: "Property Deleted successfully", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  const { propertyId } = req.params;
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

  const videoFile =
    req.files && req.files.video ? req.files.video.tempFilePath : undefined;

  const images =
    req.files && req.files.images ? req.files.images.tempFilePath : undefined;
  const avatar =
    req.files && req.files.avatar ? req.files.avatar.tempFilePath : undefined;

  try {
    let updateData = {};

    if (title) updateData.title = title;
    if (location) updateData.location = location;
    if (price) updateData.price = price;
    if (propertyType) updateData.propertyType = propertyType;
    if (description) updateData.description = description;
    if (tags) updateData.tags = tags;
    if (propertyStatus) updateData.propertyStatus = propertyStatus;
    if (bedroom) updateData.bedroom = bedroom;
    if (bathroom) updateData.bathroom = bathroom;
    if (garage) updateData.garage = garage;
    if (squareFeet) updateData.squareFeet = squareFeet;

    // Ensure existing salesSupport data is retained
    if (name || phoneNumber || whatsappNumber) {
      updateData.salesSupport = {
        ...(await Property.findById(propertyId).select("salesSupport").lean())
          .salesSupport,
        name: name || undefined,
        phoneNumber: phoneNumber || undefined,
        whatsappNumber: whatsappNumber || undefined,
      };
    }

    // Check if avatar is provided
    if (avatar) {
      const avatarResult = await cloudinary.uploader.upload(avatar, {
        use_filename: true,
        folder: "yemsays",
      });
      fs.unlinkSync(req.files.avatar.tempFilePath);
      updateData.salesSupport.avatar = avatarResult.secure_url;
    }

    // Check if images are provided
    if (images && images.length > 0) {
      const imageUploadPromises = images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          use_filename: true,
          folder: "yemsays",
        });
        fs.unlinkSync(image.tempFilePath);
        return result.secure_url;
      });
      const uploadedImages = await Promise.all(imageUploadPromises);
      updateData.media = {
        images: uploadedImages,
      };
    }

    // Check if video is provided
    if (videoFile) {
      const videoResult = await cloudinary.uploader.upload(videoFile, {
        resource_type: "video",
        folder: "yemsaysvideos",
      });
      fs.unlinkSync(req.files.video.tempFilePath);
      updateData.media = {
        videoFile: videoResult.secure_url,
      };
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updateData,
      { new: true }
    );
    res.status(200).json({ success: true, property: updatedProperty });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePropertyStatus = async (req, res) => {
  const { propertyId } = req.params;

  const { propertyStatus } = req.body;
  try {
    let updatedStatus = {};

    if (propertyStatus) {
      updatedStatus.propertyStatus = propertyStatus;
    }

    const property = await Property.findByIdAndUpdate(
      { _id: propertyId },
      updatedStatus,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getSingleProperty,
  getLatestProperty,
  deleteProperty,
  updateProperty,
  recentProperties,
  updatePropertyStatus,
};
