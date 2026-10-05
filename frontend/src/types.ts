export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "lost"];

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Note {
  id: number;
  leadId: number;
  content: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadsResponse {
  data: Lead[];
  pagination: Pagination;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}
