import Config from "../models/config.js";

export const getConfigById = async (id) => {
  const config = await Config.findById(id);
  return config;
};

export const updateConfigById = async (id, data) => {
  const config = await Config.findByIdAndUpdate(id, data, { new: true });
  return config;
};