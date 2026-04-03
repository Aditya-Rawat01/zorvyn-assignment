import { type Request, type Response } from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  toggleUserStatus,
  updateUserRole,
} from "./user.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully.",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const data = await loginUser(req.body);

    return res.json(data);
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }
};

export const updateUserRoleController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const completeUser = await updateUserRole(userId, role);
    const { password, ...user } = completeUser;
    res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const toggleUserStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const completeUser = await toggleUserStatus(userId, isActive);
    const { password, ...user } = completeUser;
    res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUserController = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid userId" });
    }
    if (req.user?.userId === userId) {
      throw new Error("You cannot modify your own account");
    }
    await deleteUser(userId);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
