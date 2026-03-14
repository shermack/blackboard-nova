import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

export const authenticate = async (req, _res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(401, "Authentication required."));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, fullName: true, role: true }
    });

    if (!user) {
      return next(new ApiError(401, "User not found."));
    }

    req.user = user;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token."));
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have access to this resource."));
  }

  return next();
};
