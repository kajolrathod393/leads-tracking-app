import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { validateLeadInput } from "../utils/validation";

interface GetLeadsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface LeadInput {
  name: string;
  email: string;
  phone: string;
  status: string;
}

export async function getLeads({ search, status, page = 1, limit = 10 }: GetLeadsParams) {
  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getLeadById(id: number) {
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }
  return lead;
}

export async function createLead(input: LeadInput) {
  const errors = validateLeadInput(input);
  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  return prisma.lead.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      status: input.status,
    },
  });
}

export async function updateLead(id: number, input: Partial<LeadInput>) {
  const errors = validateLeadInput(input, true);
  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  await getLeadById(id);

  return prisma.lead.update({
    where: { id },
    data: input,
  });
}

export async function deleteLead(id: number) {
  await getLeadById(id);
  await prisma.lead.delete({ where: { id } });
}
