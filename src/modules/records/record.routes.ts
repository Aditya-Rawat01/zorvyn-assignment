import { Router } from "express";
import { authorize } from "../../middlewares/rbac.middleware";
import { validate } from "../../utils/validate.zod.schema";
import {
  createRecordSchema,
  getRecordsQuerySchema,
  updateRecordSchema,
} from "./record.schema";
import {
  createRecordController,
  deleteRecordController,
  getRecordsController,
  updateRecordController,
} from "./record.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const recordRouter = Router();

// create record, only admin can create records.
recordRouter.post(
  "/create",
  authenticate,
  authorize("ADMIN"), // have to remove analyst from here.
  validate(createRecordSchema),
  createRecordController,
);

// get record → ADMIN and ANALYST
recordRouter.get(
  "/",
  authenticate,
  authorize("ADMIN", "ANALYST"),
  validate(getRecordsQuerySchema, "query"),
  getRecordsController,
);

// update → ADMIN only
recordRouter.post(
  "/:recordId",
  authenticate,
  authorize("ADMIN"),
  validate(updateRecordSchema),
  updateRecordController,
);

// delete → ADMIN only
recordRouter.delete(
  "/:recordId",
  authenticate,
  authorize("ADMIN"),
  deleteRecordController,
);

export default recordRouter;
