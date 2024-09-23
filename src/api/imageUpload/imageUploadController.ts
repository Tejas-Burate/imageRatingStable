// import { Request, Response } from "express";
// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: (req: Request, file, cb) => {
//         cb(null, "public"); // Save uploaded files to this directory
//     },
//     filename: (req: Request, file, cb) => {
//         const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//         const originalName = file.originalname.replace(/\s+/g, "-"); // Remove spaces from the original file name
//         const uniqueName = `${uniqueSuffix}-${originalName}`;
//         cb(null, uniqueName);
//     },
// });

// const upload = multer({
//     storage,
//     limits: {
//         fileSize: 1024 * 1024 * 10, // Limit file size to 10MB
//     },
// });

// const imgUpload = async (req: Request, res: Response) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 status: 400,
//                 error: "Bad Request",
//                 message: "No file uploaded",
//             });
//         }
//         // const imageUrls = `https://ioweb3backend.ioweb3.in/${req.file.filename}`;
//         const imageUrls = `https://datagyanibackend.ioweb3.in/${req.file.filename}`;
//         // const imageUrls = `${req.protocol}://${req.get("host")}/${
//         //   req.file.filename
//         // }`;
//         res.status(200).json({
//             status: 200,
//             message: "Image(s) uploaded successfully",
//             imageUrls,
//         });
//     } catch (error) {
//         console.log("error", error);
//         if (error instanceof multer.MulterError) {
//             if (error.code === "LIMIT_FILE_SIZE") {
//                 return res.status(400).json({
//                     status: 400,
//                     error: "Bad Request",
//                     message: "File too large",
//                 });
//             }
//         } else {
//             res.status(500).json({
//                 status: 500,
//                 error: "Internal Server Error",
//                 message: "Something went wrong",
//             });
//         }
//     }
// };

// export { upload, imgUpload };

import { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Define paths for the original and compressed image folders
const originalDir = path.resolve(__dirname, "../../../public/originals");
const compressedDir = path.resolve(__dirname, "../../../public/compressed");

// Ensure the directories exist
if (!fs.existsSync(originalDir)) {
    fs.mkdirSync(originalDir, { recursive: true });
}
if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir, { recursive: true });
}

// Multer storage configuration for saving original images
const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        cb(null, originalDir); // Save uploaded files to the 'originals' directory
    },
    filename: (req: Request, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const originalName = file.originalname.replace(/\s+/g, "-");
        const uniqueName = `${uniqueSuffix}-${originalName}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 10, // Limit file size to 10MB
    },
});

const imgUpload = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                error: "Bad Request",
                message: "No file uploaded",
            });
        }

        const originalPath = path.resolve(originalDir, req.file.filename);
        const compressedFileName = `compressed-${req.file.filename.split('.')[0]}.webp`; // Convert to WebP format
        const compressedPath = path.resolve(compressedDir, compressedFileName);


        // Compress and convert the image to WebP using sharp
        await sharp(originalPath)
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
    } catch (error) {
        console.error("Error processing image:", error);
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    status: 400,
                    error: "Bad Request",
                    message: "File too large",
                });
            }
        } else {
            res.status(500).json({
                status: 500,
                error: "Internal Server Error",
                message: "Something went wrong",
            });
        }
    }
};

export { upload, imgUpload };
