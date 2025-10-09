import axios from "axios";
import ApiError from "./error.api.js";
import httpStatus from "http-status";

export const GeoIp = async (userIP) => {
  if (!userIP || typeof userIP !== "string" || !userIP.trim()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or missing user IP");
  }
  try {
    const response = await axios.get(`https://ipapi.co/${userIP}/json/`);
    return response.data;
  } catch (err) {
    console.error("IPAPI error:", err.response?.data || err.message);
    return {
      ip: userIP,
    };
  }
};
