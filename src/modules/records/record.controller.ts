import { AuthRequest } from "../../middlewares/auth.middleware";
import type { Response } from "express";
import {
  createRecord,
  deleteRecord,
  getRecords,
  updateRecord,
} from "./record.service";

export const createRecordController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.userId;
    const record = await createRecord(userId, req.body);

    res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getRecordsController = async (req: AuthRequest, res: Response) => {
  try {
    const filters = req.query;

    let where: any = {};
    // ADMIN and ANALYST can see all the records or some particular person records and add particular filters to get structured output
    if (filters.userId) {
      where.userId = filters.userId;
    }
    
    const records = await getRecords(where, filters);

    res.json({ success: true, data: {records:records.data, ...records.pagination} });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRecordController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { recordId } = req.params;
    if (!recordId || typeof recordId !== "string") {
      return res.status(400).json({ message: "Invalid recordId" });
    }
    const record = await updateRecord(recordId, req.body);

    res.json({ success: true, data: record });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRecordController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { recordId } = req.params;
    if (!recordId || typeof recordId !== "string") {
      return res.status(400).json({ message: "Invalid recordId" });
    }
    await deleteRecord(recordId);

    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
