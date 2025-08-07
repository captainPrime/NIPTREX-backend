"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cloudinary_1 = tslib_1.__importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME || '',
    api_key: process.env.CLOUD_KEY || '',
    api_secret: process.env.CLOUD_SECRET || '',
});
exports.default = cloudinary_1.default;
//# sourceMappingURL=cloudinary.js.map