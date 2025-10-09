export const parseIp = (req) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress;
  return ip ? ip : "0.0.0.0";
};
