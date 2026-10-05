import { Request, Response, NextFunction } from "express";
import * as noteService from "../services/noteService";
import { ApiError } from "../utils/ApiError";

function parseLeadId(idParam: string): number {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "Invalid lead id");
  }
  return id;
}

export async function getNotes(req: Request, res: Response, next: NextFunction) {
  try {
    const leadId = parseLeadId(req.params.id);
    const notes = await noteService.getNotesByLeadId(leadId);
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
}

export async function createNote(req: Request, res: Response, next: NextFunction) {
  try {
    const leadId = parseLeadId(req.params.id);
    const note = await noteService.createNote(leadId, req.body?.content);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
}
