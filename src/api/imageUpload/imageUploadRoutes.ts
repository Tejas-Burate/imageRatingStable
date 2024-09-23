
import express from "express";
import { upload, imgUpload } from "./imageUploadController";

const router = express.Router();

router.post("/imgUpload", upload.single("file"), imgUpload);

export default router;