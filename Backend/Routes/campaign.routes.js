import express from "express";
import {
  campaignUpload,
  campaignDelete,
  campaignEdit,
  campaignAcceptReject,
  fetchCampaigns,
  downloadCampaign,  // Import the new function for downloading
  // fetchCampaignStats,
} from "../Controller/campaign.controller.js";

import multer from "multer";
import { protectRoute, adminRoute } from "../Middleware/auth.middlware.js";

const upload = multer();
const router = express.Router();

// Fetch all campaigns
router.get("/all", protectRoute, fetchCampaigns);

// User routes
router.post("/upload", protectRoute, upload.single("file"), campaignUpload);
router.patch("/edit/:id", protectRoute, campaignEdit);
router.delete("/delete/:id", protectRoute, campaignDelete);

// Admin routes
router.post("/accept-reject/:id", protectRoute, adminRoute, campaignAcceptReject);

// Download campaign as CSV by ID
router.get("/download/:id", protectRoute,adminRoute, downloadCampaign);

// router.get('/stats', protectRoute, adminRoute,fetchCampaignStats);
export default router;
