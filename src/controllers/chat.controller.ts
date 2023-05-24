import { NextFunction, Request, Response } from 'express';
import ChatService from '@/services/chat.service';

class ChatController {
  public chatService = new ChatService();

  /*
  |--------------------------------------------------------------------------
  | Create Chat
  |--------------------------------------------------------------------------
  */
  public createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user1, user2, milestone } = req.body;

      const chat = await this.chatService.createChat(user1, user2, milestone);

      res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: chat });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Chat By Id
  |--------------------------------------------------------------------------
  */
  public getChatById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const chat = await this.chatService.getChatById(id);

      res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: chat });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Chats By User
  |--------------------------------------------------------------------------
  */
  public getChatsByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      const chats = await this.chatService.getChatsByUser(userId);

      res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: chats });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Create Message
  |--------------------------------------------------------------------------
  */
  public createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chat, sender, content, milestone } = req.body;

      const message = await this.chatService.createMessage(chat, sender, content, milestone);

      res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: message });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Messages By Chat
  |--------------------------------------------------------------------------
  */
  public getMessagesByChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chatId } = req.params;

      const messages = await this.chatService.getMessagesByChat(chatId);

      res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: messages });
    } catch (error) {
      next(error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get Messages By Chat
  |--------------------------------------------------------------------------
  */
  public getMessagesByMilestone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chatId = req.params.id;

      const messages = await this.chatService.getMessagesByMilestone(chatId);

      res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: messages });
    } catch (error) {
      next(error);
    }
  };
}

export default ChatController;
