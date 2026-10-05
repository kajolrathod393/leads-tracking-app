import axios from "axios";
import type { Lead, LeadFormData, LeadsResponse, Note } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

export interface ApiErrorResponse {
  message: string;
  errors?: string[];
}

export async function fetchLeads(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<LeadsResponse> {
  const response = await api.get<LeadsResponse>("/leads", { params });
  return response.data;
}

export async function fetchLead(id: string | number): Promise<Lead> {
  const response = await api.get<Lead>(`/leads/${id}`);
  return response.data;
}

export async function createLead(data: LeadFormData): Promise<Lead> {
  const response = await api.post<Lead>("/leads", data);
  return response.data;
}

export async function deleteLead(id: string | number): Promise<void> {
  await api.delete(`/leads/${id}`);
}

export async function fetchNotes(leadId: string | number): Promise<Note[]> {
  const response = await api.get<Note[]>(`/leads/${leadId}/notes`);
  return response.data;
}

export async function createNote(leadId: string | number, content: string): Promise<Note> {
  const response = await api.post<Note>(`/leads/${leadId}/notes`, { content });
  return response.data;
}

export default api;
