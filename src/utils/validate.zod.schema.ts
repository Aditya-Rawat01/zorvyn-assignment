import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

type Source = "body" | "query" | "params";

export const validate =
  (schema: ZodType, source: Source = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];

    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues,
      });
    }

    // req[source] = result.data as any; // not working for req query.
    Object.assign(req[source], result.data); // mutating instead of replacing.
    next();
  };