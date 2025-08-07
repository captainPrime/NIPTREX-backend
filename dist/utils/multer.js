"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const tslib_1 = require("tslib");
const multer_1 = tslib_1.__importDefault(require("multer"));
const multerStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});
exports.multerUpload = (0, multer_1.default)({ storage: multerStorage });
//# sourceMappingURL=multer.js.map