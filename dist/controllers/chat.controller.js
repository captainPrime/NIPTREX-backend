"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chat_service_1 = tslib_1.__importDefault(require("../services/chat.service"));
const wordChecker_1 = require("../utils/wordChecker");
const HttpException_1 = require("../exceptions/HttpException");
const users_service_1 = tslib_1.__importDefault(require("../services/users.service"));
class ChatController {
    constructor() {
        this.userService = new users_service_1.default();
        this.chatService = new chat_service_1.default();
        /*
        |--------------------------------------------------------------------------
        | Create Chat
        |--------------------------------------------------------------------------
        */
        this.createChat = async (req, res, next) => {
            try {
                const { participants, milestone } = req.body;
                // Check if chat already exists for the milestone
                const existingChat = await this.chatService.getChatByMilestone(milestone);
                // If it exists, return the existing chat
                if (existingChat) {
                    return res.status(200).json({
                        status: 200,
                        response_code: 6001,
                        message: 'CHAT_ALREADY_EXISTS',
                        data: existingChat,
                    });
                }
                const chat = await this.chatService.createChat(participants, milestone);
                res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: chat });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Chat By Id
        |--------------------------------------------------------------------------
        */
        this.getChatById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const chat = await this.chatService.getChatById(id);
                res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: chat });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Chats By User
        |--------------------------------------------------------------------------
        */
        this.getChatsByUser = async (req, res, next) => {
            try {
                const userId = req.user.id;
                console.log(userId, 'CONTROLLER');
                const chats = await this.chatService.getChatsByUser(userId);
                res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: chats });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Create Message
        |--------------------------------------------------------------------------
        */
        this.createMessage = async (req, res, next) => {
            try {
                const { chatId, sender, content, files } = req.body;
                if (content && files) {
                    throw new HttpException_1.HttpException(400, 1004, 'CANT_SEND_BOTH_FILES_AND_MESSAGE');
                }
                if (content && (0, wordChecker_1.containsBadWords)(content)) {
                    throw new HttpException_1.HttpException(400, 1004, 'BAD_WORDS_NOT_ALLOWED');
                }
                const payload = Object.assign({ chatId,
                    sender, is_file: files ? true : false }, (files ? { files } : { content }));
                const message = await this.chatService.createMessage(payload);
                res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: message });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Messages By Chat
        |--------------------------------------------------------------------------
        */
        this.getMessagesByChat = async (req, res, next) => {
            try {
                const { chatId } = req.params;
                const messages = await this.chatService.getMessagesByChat(chatId);
                const dataWithUserInfo = await Promise.all(messages.map(async (data) => {
                    const user = await this.userService.findUserById(data.sender.toString());
                    return Object.assign(Object.assign({}, data.toObject()), { first_name: user.first_name, last_name: user.last_name, profile_picture: user.profile_picture });
                }));
                res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: dataWithUserInfo });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Messages By Chat
        |--------------------------------------------------------------------------
        */
        this.getMessagesByMilestone = async (req, res, next) => {
            try {
                const milestoneId = req.params.id;
                const messages = await this.chatService.getMessagesByMilestone(milestoneId);
                console.log(messages);
                if (!messages || (messages === null || messages === void 0 ? void 0 : messages.length) === 0) {
                    return res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: [] });
                }
                const dataWithUserInfo = await Promise.all(messages === null || messages === void 0 ? void 0 : messages.map(async (data) => {
                    const user = await this.userService.findUserById(data.sender.toString());
                    return Object.assign(Object.assign({}, data.toObject()), { first_name: user.first_name, last_name: user.last_name, profile_picture: user.profile_picture });
                }));
                res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: dataWithUserInfo });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Messages By Chat
        |--------------------------------------------------------------------------
        */
        this.getUserMessages = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const messages = await this.chatService.getuserMessages(userId);
                res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: messages });
            }
            catch (error) {
                next(error);
            }
        };
        /*
        |--------------------------------------------------------------------------
        | Get Files By Milestone
        |--------------------------------------------------------------------------
        */
        this.getFilesByMilestone = async (req, res, next) => {
            try {
                const chatId = req.params.id;
                const messages = await this.chatService.getFilesByMilestone(chatId);
                res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: messages });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = ChatController;
//# sourceMappingURL=chat.controller.js.map