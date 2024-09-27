"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imgUpload = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Define paths for the original and compressed image folders
const originalDir = path_1.default.resolve(__dirname, "../../../public/originals");
const compressedDir = path_1.default.resolve(__dirname, "../../../public/compressed");
// Ensure the directories exist
if (!fs_1.default.existsSync(originalDir)) {
    fs_1.default.mkdirSync(originalDir, { recursive: true });
}
if (!fs_1.default.existsSync(compressedDir)) {
    fs_1.default.mkdirSync(compressedDir, { recursive: true });
}
// Multer storage configuration for saving original images
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, originalDir); // Save uploaded files to the 'originals' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const originalName = file.originalname.replace(/\s+/g, "-");
        const uniqueName = `${uniqueSuffix}-${originalName}`;
        cb(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10, // Limit file size to 10MB
    },
});
exports.upload = upload;
const imgUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                error: "Bad Request",
                message: "No file uploaded",
            });
        }
        const originalPath = path_1.default.resolve(originalDir, req.file.filename);
        const compressedFileName = `compressed-${req.file.filename.split('.')[0]}.webp`; // Convert to WebP format
        const compressedPath = path_1.default.resolve(compressedDir, compressedFileName);
        // Compress and convert the image to WebP using sharp
        yield (0, sharp_1.default)(originalPath)
            .resize({
            width: 800,
            withoutEnlargement: true,
        })
            .webp({
            quality: 60, // Adjust the quality for WebP format
        })
            .toFile(compressedPath);
        // const originalImageUrl = `http://localhost:8080/${req.file.filename}`;
        // const compressedImageUrl = `http://localhost:8080/${compressedFileName}`;
        const originalImageUrl = `https://imagerating.ioweb3.in/${req.file.filename}`;
        const compressedImageUrl = `https://imagerating.ioweb3.in/${compressedFileName}`;
        res.status(200).json({
            status: 200,
            message: "Image(s) uploaded, compressed, and saved successfully",
            originalImageUrl,
            compressedImageUrl,
        });
    }
    catch (error) {
        console.error("Error processing image:", error);
        if (error instanceof multer_1.default.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    status: 400,
                    error: "Bad Request",
                    message: "File too large",
                });
            }
        }
        else {
            res.status(500).json({
                status: 500,
                error: "Internal Server Error",
                message: "Something went wrong",
            });
        }
    }
});
exports.imgUpload = imgUpload;
