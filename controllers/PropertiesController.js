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
    // const similarLand = await Property.findOne({ propertyType: "land" }).limit(3)
    // const similarHouse = await Property.findOne({ propertyType: "house" }).limit(3)

    // const similarProperties = [
    //   ...similarLand,
    //   ...similarHouse,
    // ]

    const properties = await Property.find();
    res.status(200).json({
      msg: "success",
      properties,
      NumOfProperties: properties.length,
      // similarProperties,
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
}

const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findByIdAndDelete({ _id: propertyId });
    res.status(201).json({ success: "deleted successfully", property });
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

  const video = req.files.video ? req.files.video.tempFilePath : undefined;
  const images = req.files.images;
  const avatar = req.files.avatar ? req.files.avatar.tempFilePath : undefined;

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
    if (video) {
      const videoResult = await cloudinary.uploader.upload(video, {
        resource_type: "video",
        folder: "yemsaysvideos",
      });
      fs.unlinkSync(req.files.video.tempFilePath);
      updateData.media = {
        video: videoResult.secure_url,
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



module.exports = {
  createProperty,
  getProperties,
  getSingleProperty,
  getLatestProperty,
  deleteProperty,
  updateProperty,
  recentProperties,
};
