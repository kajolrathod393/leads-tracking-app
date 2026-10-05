import { Router } from "express";
import * as noteController from "../controllers/noteController";

const router = Router({ mergeParams: true });

router.get("/", noteController.getNotes);
router.post("/", noteController.createNote);

export default router;
