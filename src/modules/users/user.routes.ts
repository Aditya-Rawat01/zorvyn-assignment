import { Router } from "express";
import { createUserController, deleteUserController, loginUserController, toggleUserStatusController, updateUserRoleController } from "./user.controller";
import { createUserSchema, loginUserSchema, toggleStatusSchema, updateRoleSchema } from "./user.schema";
import { validate } from "../../utils/validate.zod.schema";
import { authorize } from "../../middlewares/rbac.middleware";
import { authenticate } from "../../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post(
  "/create",
  authenticate,
  authorize("ADMIN"),
  validate(createUserSchema),
  createUserController,
);

userRouter.post("/login", validate(loginUserSchema), loginUserController);

userRouter.post(
  "/:userId/role",
  authenticate,
  authorize("ADMIN"),
  validate(updateRoleSchema),
  updateUserRoleController
);

userRouter.post(
  "/:userId/status",
  authenticate,
  authorize("ADMIN"),
  validate(toggleStatusSchema),
  toggleUserStatusController
);

userRouter.delete(
  "/:userId",
  authenticate,
  authorize("ADMIN"),
  deleteUserController
);

export default userRouter;
