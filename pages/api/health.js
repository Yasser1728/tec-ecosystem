import { prisma } from "@/lib/db/prisma";

export default async function handler(req, res) {
  try {
    const usersCount = await prisma.user.count();
    res.status(200).json({
      status: "ok",
      users: usersCount,
    });
  } catch (error) {
    res.status(200).json({
      status: "prisma_not_ready",
      message: "Database not connected yet",
    });
  }
}
