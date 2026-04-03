import { getDashboardSummary } from "./dashboard.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import type { Response } from 'express'
export const getDashboardController = async (req: AuthRequest, res: Response) => {
  try {
    const { role, userId } = req.user!;
    const filters = req.query;
  
    let where: any = {};
  
    if (role === "USER") {
      // viewer → only see their own data
      where.userId = userId;
    } else {
      // ANALYST + ADMIN, can see particular person data or complete aggregated data
      if (typeof filters.userId === "string") {
        where.userId = filters.userId;
      }
    }
  
    const data = await getDashboardSummary(where);
  
    res.json({ success: true, data });

  } catch (error:any) {
    res.status(400).json({
      message: error.message
    })
  }
};