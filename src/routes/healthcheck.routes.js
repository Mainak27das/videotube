import { Router } from "express";
import healthcheckConteroller from "../controllers/healthcheck.controller.js";

const router= Router();

router.route("/").get(healthcheckConteroller);
export default router;