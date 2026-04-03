import prisma from "../../lib/prisma";

export const createRecord = async (userId: string, data: any) => {
  return prisma.record.create({
    data: {
      ...data,
      userId,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
};

export const getRecords = async (where: any, filters: any) => {
  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = filters.category;

  const includeDeleted = filters.includeDeleted === "true";
  if (!includeDeleted) {
    where.isDeleted = false;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.record.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.record.count({ where }),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateRecord = async (recordId: string, data: any) => {
  return prisma.record.update({
    where: { id: recordId, isDeleted: false },
    data,
  });
};

export const deleteRecord = async (recordId: string) => {
  return prisma.record.update({
    where: { id: recordId, isDeleted: false },
    data: { isDeleted: true },
  });
};

export const restoreRecord = async (recordId: string) => {
  return prisma.record.update({
    where: { id: recordId },
    data: { isDeleted: false },
  });
};
