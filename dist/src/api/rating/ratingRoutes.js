"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratingController_1 = require("./ratingController");
const router = express_1.default.Router();
router.post("/createRating", ratingController_1.createRating);
router.get("/getAllRating", ratingController_1.getAllRating);
router.get("/getRatingById/:id", ratingController_1.getRatingById);
router.put("/updateRatingById/:id", ratingController_1.updateRatingById);
router.delete("/deleteRatingById/:id", ratingController_1.deleteRatingById);
exports.default = router;
