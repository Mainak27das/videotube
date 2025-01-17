import { Router } from "express";
import healthcheckConteroller from "../controllers/healthcheck.controller.js";

const router= Router();

router.route("/healthcheck").get(healthcheckConteroller);
export default router;