import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "USER" | "ANALYST" | "ADMIN";
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied: Unauthorized" });
    }

    const token = authHeader.split(" ")[1] || "";

    const decoded = verifyToken(token) as any;

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({ message: "Access denied: Invalid token" });
  }
};
