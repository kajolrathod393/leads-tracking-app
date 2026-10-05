import { Request, Response, NextFunction } from "express";
import * as leadService from "../services/leadService";
import { ApiError } from "../utils/ApiError";

function parseLeadId(idParam: string): number {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "Invalid lead id");
  }
  return id;
}

export async function getLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const result = await leadService.getLeads({ search, status, page, limit });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getLeadById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseLeadId(req.params.id);
    const lead = await leadService.getLeadById(id);
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
}

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
}

export async function updateLead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseLeadId(req.params.id);
    const lead = await leadService.updateLead(id, req.body);
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
}

export async function deleteLead(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseLeadId(req.params.id);
    await leadService.deleteLead(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
