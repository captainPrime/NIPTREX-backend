import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import ChatController from '@/controllers/chat.controller';
import authMiddleware from '@/middlewares/auth.middleware';

class ChatRoute implements Routes {
  public path = '/chat';
  public router = Router();
  public chatController = new ChatController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware(['freelancer', 'client']), this.chatController.createChat);
    this.router.get(`${this.path}/:id`, authMiddleware(['freelancer', 'client']), this.chatController.getChatById);
    this.router.get(`${this.path}/milestone/:id`, authMiddleware(['freelancer', 'client']), this.chatController.getMessagesByMilestone);
    this.router.get(`${this.path}/getFilesByMilestone/:id`, authMiddleware(['freelancer', 'client']), this.chatController.getFilesByMilestone);
    this.router.get(`${this.path}/user/:userId`, authMiddleware(['freelancer', 'client']), this.chatController.getChatsByUser);
    this.router.post(`${this.path}/message`, authMiddleware(['freelancer', 'client']), this.chatController.createMessage);
    this.router.get(`${this.path}/message/:chatId`, authMiddleware(['freelancer', 'client']), this.chatController.getMessagesByChat);
  }
}

export default ChatRoute;
