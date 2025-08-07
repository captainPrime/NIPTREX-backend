"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const chat_controller_1 = tslib_1.__importDefault(require("@/controllers/chat.controller"));
const auth_middleware_1 = tslib_1.__importDefault(require("@/middlewares/auth.middleware"));
class ChatRoute {
    constructor() {
        this.path = '/chat';
        this.router = (0, express_1.Router)();
        this.chatController = new chat_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.chatController.createChat);
        this.router.get(`${this.path}`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.chatController.getUserMessages);
        this.router.get(`${this.path}/milestone/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.chatController.getMessagesByMilestone);
        this.router.get(`${this.path}/getFilesByMilestone/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.chatController.getFilesByMilestone);
        this.router.get(`${this.path}/user`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.chatController.getChatsByUser);
        this.router.get(`${this.path}/:id`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.chatController.getChatById);
        this.router.post(`${this.path}/message`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.chatController.createMessage);
        this.router.get(`${this.path}/message/:chatId`, (0, auth_middleware_1.default)(['freelancer', 'client']), this.chatController.getMessagesByChat);
    }
}
exports.default = ChatRoute;
//# sourceMappingURL=chat.route.js.map