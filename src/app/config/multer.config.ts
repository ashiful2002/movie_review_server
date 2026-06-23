import multer from "multer";

// Use memory storage so file buffers can be passed directly to
// the `uploadFileToCloudinary` helper (cloudinary v2 compatible).
const storage = multer.memoryStorage();

export const multerUpload = multer({ storage });
