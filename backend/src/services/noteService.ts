import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { getLeadById } from "./leadService";

export async function getNotesByLeadId(leadId: number) {
  await getLeadById(leadId);
  return prisma.note.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createNote(leadId: number, content: unknown) {
  await getLeadById(leadId);

  if (typeof content !== "string" || content.trim() === "") {
    throw new ApiError(400, "Validation failed", ["Content is required"]);
  }

  return prisma.note.create({
    data: {
      content,
      leadId,
    },
  });
}
