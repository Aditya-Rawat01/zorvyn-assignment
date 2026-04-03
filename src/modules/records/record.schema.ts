import { z } from "zod";

export const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().optional(),
  description: z.string().optional(),
  date: z.iso.datetime().optional(),
});

export const updateRecordSchema = createRecordSchema.partial();

export const getRecordsQuerySchema = z.object({
  userId: z.uuid().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  includeDeleted: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
});
