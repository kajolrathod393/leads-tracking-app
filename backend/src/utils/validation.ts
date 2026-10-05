export const LEAD_STATUSES = ["new", "contacted", "qualified", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadInput {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  status?: unknown;
}

export function validateLeadInput(input: LeadInput, isPartial = false): string[] {
  const errors: string[] = [];
  const { name, email, phone, status } = input;

  const isMissing = (value: unknown) => value === undefined || (typeof value === "string" && value.trim() === "");

  if (!isPartial || name !== undefined) {
    if (isMissing(name)) errors.push("Name is required");
    else if (typeof name !== "string") errors.push("Name must be a string");
  }

  if (!isPartial || email !== undefined) {
    if (isMissing(email)) errors.push("Email is required");
    else if (typeof email !== "string" || !EMAIL_REGEX.test(email)) errors.push("Email is invalid");
  }

  if (!isPartial || phone !== undefined) {
    if (isMissing(phone)) errors.push("Phone is required");
    else if (typeof phone !== "string") errors.push("Phone must be a string");
  }

  if (!isPartial || status !== undefined) {
    if (isMissing(status)) errors.push("Status is required");
    else if (typeof status !== "string" || !LEAD_STATUSES.includes(status as LeadStatus)) {
      errors.push(`Status must be one of: ${LEAD_STATUSES.join(", ")}`);
    }
  }

  return errors;
}
