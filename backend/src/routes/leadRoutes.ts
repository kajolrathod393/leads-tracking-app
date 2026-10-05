import { Router } from "express";
import * as leadController from "../controllers/leadController";
import noteRoutes from "./noteRoutes";

const router = Router();

router.get("/", leadController.getLeads);
router.post("/", leadController.createLead);
router.get("/:id", leadController.getLeadById);
router.patch("/:id", leadController.updateLead);
router.delete("/:id", leadController.deleteLead);

router.use("/:id/notes", noteRoutes);

export default router;
