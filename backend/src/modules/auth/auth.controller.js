import { prisma } from "../../config/prisma.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loginUser, registerUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
});

export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdCourses: {
        select: { id: true, name: true, code: true }
      },
      enrollments: {
        include: {
          course: {
            select: { id: true, name: true, code: true }
          }
        }
      }
    }
  });

  res.json({ user });
});
