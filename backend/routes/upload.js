import express, { Router } from "express";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

import {handleUpload,handleUploadFile} from "../controllers/upload.js";

const uploadRouter = express.Router();


uploadRouter.route("/")
  .get(handleUpload)

uploadRouter.post("/file", upload.single("file") , handleUploadFile);
export default uploadRouter;