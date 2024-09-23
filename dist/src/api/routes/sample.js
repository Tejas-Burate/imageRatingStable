"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/sample.ts
/**
 * @swagger
 * /sample:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/sample', (req, res) => {
    res.json({ message: 'This is a sample message' });
});
exports.default = router;
