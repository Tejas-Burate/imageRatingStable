"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("./authController");
const router = express_1.default.Router();
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Auth:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 */
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: tburate19@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: tburate19@gmail.com
 *               password:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 *       402:
 *         description: Bad Request
 */
/**
 * @swagger
 * /auth/getAllAuth:
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 12345
 *                   username:
 *                     type: string
 *                     example: johndoe
 */
/**
 * @swagger
 * /auth/getAuthById/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 12345
 *                 username:
 *                   type: string
 *                   example: johndoe
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /auth/updateAuthById/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe_updated
 *               password:
 *                 type: string
 *                 example: newpass123
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/googleAuthLogAndRegister", authController_1.googleAuthLogAndRegister);
router.get("/getAllAuth", authController_1.getAllAuth);
router.get("/getAuthById/:id", authController_1.getAuthById);
router.get("/checkUser/:id", authController_1.checkUser);
router.get("/checkUserActiveSession/:userId", authController_1.checkUserActiveSession);
router.post("/getAuthFilters", authController_1.getAuthFilters);
router.put("/updateAuthById/:id", authController_1.updateAuthById);
router.get("/updateUserCountry/:id", authController_1.updateUserCountry);
exports.default = router;
