import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorize =
  (...roles: ("USER" | "ANALYST" | "ADMIN")[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Access denied: Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions." });
    }

    next();
  };
