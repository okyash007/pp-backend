import { getConfigById, updateConfigById } from "../services/config.service.js";
import { ApiResponse } from "../utils/response.api.js";

export const getConfigController = async (req, res) => {
  const { id } = req.params;
  const config = await getConfigById(id);
  res.json(new ApiResponse(200, config));
};

export const updateConfigController = async (req, res) => {
  const { id } = req.params;
  const config = await updateConfigById(id, req.body);
  res.json(new ApiResponse(200, config));
};