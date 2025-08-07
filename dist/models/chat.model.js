"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const toJSON_1 = require("@/modules/toJSON");
const messageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chat', required: true },
    content: {
        type: String,
        required: false,
    },
    is_file: { type: Boolean, required: true, default: false },
    files: [
        {
            name: {
                type: String,
                required: function () {
                    return this.is_file;
                },
            },
            url: {
                type: String,
                required: function () {
                    return this.is_file;
                },
            },
        },
    ],
    created_at: { type: Date, default: Date.now },
}, { versionKey: false });
const chatSchema = new mongoose_1.Schema({
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    milestone: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Bid', required: true },
    messages: [messageSchema],
}, { versionKey: false });
// add plugin that converts mongoose to json
chatSchema.plugin(toJSON_1.toJSON);
messageSchema.plugin(toJSON_1.toJSON);
// Create and export the Chat model
const ChatModel = (0, mongoose_1.model)('Chat', chatSchema);
exports.ChatModel = ChatModel;
const MessageModel = (0, mongoose_1.model)('Message', messageSchema);
exports.MessageModel = MessageModel;
//# sourceMappingURL=chat.model.js.map