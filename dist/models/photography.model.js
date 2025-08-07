"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photography = void 0;
const paginate_1 = require("../modules/paginate");
const toJSON_1 = require("../modules/toJSON");
const mongoose_1 = require("mongoose");
const photographySchema = new mongoose_1.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    cloudinary_id: {
        type: String,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: [String],
        default: [],
    },
    tags: {
        type: [String],
        default: [],
    },
    licence: {
        type: String,
        default: '',
    },
    listAsNFT: {
        type: Boolean,
        default: false,
    },
});
photographySchema.plugin(toJSON_1.toJSON);
photographySchema.plugin(paginate_1.paginate);
const Photography = (0, mongoose_1.model)('Photography', photographySchema);
exports.Photography = Photography;
//# sourceMappingURL=photography.model.js.map