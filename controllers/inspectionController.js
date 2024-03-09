const Inspection = require("../models/inspection");

const createInspection = async (req, res) => {
  const { userId } = req.user;

  req.body.creator = userId;

  try {
    const inspection = await Inspection.create({
      ...req.body,
      creator: userId,
    });
    res.status(201).json({ msg: "success", inspection });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInspection = async (req, res) => {
  try {
    const inspection = await Inspection.find();
    res.status(200).json({ msg: "success", inspection });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getRecentInspection = async (req, res) => {
  try {
    const recent = await Inspection.find().sort("-createdAt").limit(2);
    res.status(200).json({ msg: "success", recent });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deleteInspection = async (req, res) => {
  const { inspectionId } = req.params;
  try {
    const inspection = await Inspection.findByIdAndDelete({
      _id: inspectionId,
    });
    res.status(200).json({ msg: "success", inspection });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createInspection,
  getInspection,
  deleteInspection,
  getRecentInspection,
};
