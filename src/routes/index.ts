import { Router } from "express";
import {
  getCirculatingSupply,
  getTotalSupplyMAHA,
  getTotalSupplyZAI,
  mahaInrPrice,
} from "../controller/onChainData";
// import { getTotalSupplyZAI } from "../controller/ZAI";

const router = Router();
// router.get("/zai/supply/total", getTotalSupplyZAI);
router.use("/circulating-supply", getCirculatingSupply);
router.use("/total-supply-maha", getTotalSupplyMAHA); //maha
router.use("/total-supply-zai", getTotalSupplyZAI);
router.use("/maha-inr", mahaInrPrice);

export default router;
