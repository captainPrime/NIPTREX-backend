"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const tslib_1 = require("tslib");
const multer_1 = tslib_1.__importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
// Cloudinary Configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});
// Multer and Cloudinary Storage Configuration
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (_req, _file) => {
        return {
            folder: 'images',
            allowedFormats: ['jpg', 'png'],
            transformation: [{ width: 500, height: 500, crop: 'limit' }],
        };
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.upload = upload;
//# sourceMappingURL=multerConfig.js.map