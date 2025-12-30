import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { method } = req;

  try {
    switch (method) {
      case "GET":
        return await getProfile(req, res, session);
      case "PUT":
        return await updateProfile(req, res, session);
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("Profile API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}

async function getProfile(req, res, session) {
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      piId: true,
      username: true,
      email: true,
      tier: true,
      status: true,
      language: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ success: true, data: user });
}

async function updateProfile(req, res, session) {
  const { username, email, language } = req.body;

  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (language) updateData.language = language;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
    select: {
      id: true,
      piId: true,
      username: true,
      email: true,
      tier: true,
      status: true,
      language: true,
    },
  });

  return res.status(200).json({ success: true, data: user });
}
