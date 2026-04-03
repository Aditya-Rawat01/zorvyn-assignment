import { Router } from "express";
import { getDashboardController } from "./dashboard.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const dashboardRouter = Router();

dashboardRouter.get("/", authenticate, getDashboardController);

export default dashboardRouter;
