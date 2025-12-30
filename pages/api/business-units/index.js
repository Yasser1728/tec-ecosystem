import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        return await getBusinessUnits(req, res);
      case "POST":
        return await createBusinessUnit(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
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

async function getBusinessUnits(req, res) {
  const { status, includePages, includeFeatures } = req.query;

  const where = status ? { status } : {};

  const include = {
    pages: includePages === "true",
    features: includeFeatures === "true",
  };

  const businessUnits = await prisma.businessUnit.findMany({
    where,
    include,
    orderBy: { createdAt: "asc" },
  });

  return res.status(200).json({
    success: true,
    count: businessUnits.length,
    data: businessUnits,
  });
}

async function createBusinessUnit(req, res) {
  const {
    key,
    name,
    displayName,
    icon,
    tagline,
    description,
    color,
    pages,
    features,
  } = req.body;

  if (!key || !name || !displayName) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["key", "name", "displayName"],
    });
  }

  const businessUnit = await prisma.businessUnit.create({
    data: {
      key,
      name,
      displayName,
      icon: icon || "🏢",
      tagline: tagline || "",
      description: description || "",
      color: color || "from-gray-900 to-gray-800",
      pages: pages
        ? {
            create: pages.map((page, index) => ({
              path: page.path,
              title: page.title,
              description: page.description || "",
            })),
          }
        : undefined,
      features: features
        ? {
            create: features.map((feature, index) => ({
              icon: feature.icon,
              title: feature.title,
              description: feature.description,
              order: index,
            })),
          }
        : undefined,
    },
    include: {
      pages: true,
      features: true,
    },
  });

  return res.status(201).json({
    success: true,
    data: businessUnit,
  });
}
