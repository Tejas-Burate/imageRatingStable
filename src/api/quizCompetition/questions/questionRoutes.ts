import express from "express";
import {
    createQuizQuestion,
    verifyQuizQuestionAnswer,
    getAllQuestion,
    getQuestionById,
    getAllQuestionByCategoryId,
    getFiveByQuestionByQuizId,
    getNextQuestionByQuizId,
    bulkUploadCompetitionQuestions,
    updateQuestionById,
    deleteQuestionById,
    getCompetitionQuestionsFilters
} from "./questionController";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: API for managing questions
 */

/**
 * @swagger
 * /question/createQuestion:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: "66bc76d05993b508db105493"
 *               questionText:
 *                 type: string
 *                 example: "What is the capital of France?"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Paris"
 *               correctAnswer:
 *                 type: string
 *                 example: "Paris"
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /question/getAllQuestion:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "12345"
 *                   questionText:
 *                     type: string
 *                     example: "What is the capital of France?"
 *                   categoryId:
 *                     type: string
 *                     example: "66bc76d05993b508db105493"
 */

/**
 * @swagger
 * /question/getQuestionById/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question
 *     responses:
 *       200:
 *         description: A question object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12345"
 *                 questionText:
 *                   type: string
 *                   example: "What is the capital of France?"
 *                 categoryId:
 *                   type: string
 *                   example: "66bc76d05993b508db105493"
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /question/getAllQuestionByCategoryId/{id}:
 *   get:
 *     summary: Get all questions by category ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: A list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "12345"
 *                   questionText:
 *                     type: string
 *                     example: "What is the capital of France?"
 *                   categoryId:
 *                     type: string
 *                     example: "66bc76d05993b508db105493"
 */

/**
 * @swagger
 * /question/getFiveQuestionByCategoryId/{id}:
 *   get:
 *     summary: Get five random questions by category ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: A list of five questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "12345"
 *                   questionText:
 *                     type: string
 *                     example: "What is the capital of France?"
 *                   categoryId:
 *                     type: string
 *                     example: "66bc76d05993b508db105493"
 */

/**
 * @swagger
 * /question/getNextQuestionByQuizId:
 *   post:
 *     summary: Get the next question by category ID
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: "66bc76d05993b508db105493"
 *               lastQuestionId:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: The next question in the category
 *       404:
 *         description: No more questions available
 */

/**
 * @swagger
 * /question/updateQuestionById/{id}:
 *   put:
 *     summary: Update a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *                 example: "What is the capital of Spain?"
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Madrid"
 *               correctAnswer:
 *                 type: string
 *                 example: "Madrid"
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /question/deleteQuestionById/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question to delete
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 */

router.post("/createQuizQuestion", createQuizQuestion);
router.get("/getAllQuestion", getAllQuestion);
router.get("/getQuestionById/:id", getQuestionById);
router.post("/verifyQuizQuestionAnswer", verifyQuizQuestionAnswer);
router.get("/getAllQuestionByCategoryId/:id", getAllQuestionByCategoryId);
router.post("/getFiveByQuestionByQuizId", getFiveByQuestionByQuizId);
router.post("/getNextQuestionByQuizId", getNextQuestionByQuizId);
router.post("/getCompetitionQuestionsFilters", getCompetitionQuestionsFilters);
router.post("/bulkUploadCompetitionQuestions", upload.single("file"), bulkUploadCompetitionQuestions);
router.put("/updateQuestionById/:id", updateQuestionById);
router.delete("/deleteQuestionById/:id", deleteQuestionById);

export default router;
