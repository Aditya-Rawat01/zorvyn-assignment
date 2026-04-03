import prisma from "../../lib/prisma";

export const getDashboardSummary = async (where: any = {}) => {
  const monthlyTrendsQuery = where.userId
    ? prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "date") as month,
        SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as expense
      FROM "Record"
      WHERE "userId" = ${where.userId}
      GROUP BY month
      ORDER BY month ASC
    `
    : prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "date") as month,
        SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as expense
      FROM "Record"
      GROUP BY month
      ORDER BY month ASC
    `;

  const [categoryTotals, recent, monthlyTrends] = await Promise.all([
    prisma.record.groupBy({
      by: ["category", "type"],
      where,
      _sum: { amount: true },
    }),
    prisma.record.findMany({
      where,
      take: 5,
      orderBy: { date: "desc" },
    }),
    monthlyTrendsQuery,
  ]);

  // filtering out based on type, reduces db calls.
  let totalIncome = 0;
  let totalExpense = 0;

  for (const r of categoryTotals) {
    // only two types are present, so this is safe for now.
    if (r.type === "INCOME") {
      totalIncome += r._sum.amount || 0;
    } else {
      totalExpense += r._sum.amount || 0;
    }
  }

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    categoryTotals,
    recent,
    monthlyTrends,
  };
};
