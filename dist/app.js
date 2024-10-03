"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routesRegistry_1 = __importDefault(require("./src/config/routesRegistry"));
const cors_1 = __importDefault(require("cors"));
const sample_1 = __importDefault(require("./src/api/routes/sample"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8063;
require("./src/config/dbConnection");
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
}));
app.use(express_1.default.json());
// app.use(requestLogger);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(express_1.default.static(path_1.default.join(__dirname, "public/compressed")));
app.use(express_1.default.static(path_1.default.join(__dirname, "public/originals")));
// Serve compressed images at /uploads/compressed/
app.use('/uploads/compressed', express_1.default.static(path_1.default.join(__dirname, './uploads/compressed')));
app.use(sample_1.default);
(0, routesRegistry_1.default)(app);
app.get("/", (request, response) => {
    response.status(200).send("Welcome to Data Gyani");
});
app.listen(PORT, () => {
    console.log(`🌐 Server running at PORT: ${PORT}`);
}).on("error", (error) => {
    throw new Error(error.message);
});
