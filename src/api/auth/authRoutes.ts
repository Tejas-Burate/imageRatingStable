import express from "express";
import {
    register,
    login,
    getAllAuth,
    getAuthById,
    updateAuthById,
    checkUser,
    getAuthFilters,
    googleAuthLogAndRegister,
    updateUserCountry,
    checkUserActiveSession
} from "./authController";

const router = express.Router();

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

router.post("/register", register);
router.post("/login", login);
router.post("/googleAuthLogAndRegister", googleAuthLogAndRegister);
router.get("/getAllAuth", getAllAuth);
router.get("/getAuthById/:id", getAuthById);
router.get("/checkUser/:id", checkUser);
router.get("/checkUserActiveSession/:userId", checkUserActiveSession);
router.post("/getAuthFilters", getAuthFilters);
router.put("/updateAuthById/:id", updateAuthById);
router.get("/updateUserCountry/:id", updateUserCountry);

export default router;
