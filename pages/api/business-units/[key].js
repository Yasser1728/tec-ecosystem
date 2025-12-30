import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method, query } = req;
  const { key } = query;

  try {
    switch (method) {
      case "GET":
        return await getBusinessUnit(req, res, key);
      case "PUT":
        return await updateBusinessUnit(req, res, key);
      case "DELETE":
        return await deleteBusinessUnit(req, res, key);
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}

async function getBusinessUnit(req, res, key) {
  const businessUnit = await prisma.businessUnit.findUnique({
    where: { key },
    include: {
      pages: {
        orderBy: { createdAt: "asc" },
      },
      features: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!businessUnit) {
    return res.status(404).json({
      error: "Business Unit not found",
      key,
    });
  }

  // Increment views
  await prisma.businessUnit.update({
    where: { key },
    data: { views: { increment: 1 } },
  });

  return res.status(200).json({
    success: true,
    data: businessUnit,
  });
}

async function updateBusinessUnit(req, res, key) {
  const { name, displayName, icon, tagline, description, color, status } =
    req.body;

  const businessUnit = await prisma.businessUnit.update({
    where: { key },
    data: {
      ...(name && { name }),
      ...(displayName && { displayName }),
      ...(icon && { icon }),
      ...(tagline && { tagline }),
      ...(description && { description }),
      ...(color && { color }),
      ...(status && { status }),
    },
    include: {
      pages: true,
      features: true,
    },
  });

  return res.status(200).json({
    success: true,
    data: businessUnit,
  });
}

async function deleteBusinessUnit(req, res, key) {
  await prisma.businessUnit.delete({
    where: { key },
  });

  return res.status(200).json({
    success: true,
    message: `Business Unit '${key}' deleted successfully`,
  });
}
