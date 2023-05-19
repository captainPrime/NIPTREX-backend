import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import ChatService from '@/services/chat.service';
import { HttpException } from '@/exceptions/HttpException';

class ChatController {
  public chatService = new ChatService();

  /*
  |--------------------------------------------------------------------------
  | Create Chat
  |--------------------------------------------------------------------------
  */
  public createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user1, user2 } = req.body;

      const chat = await this.chatService.createChat(new Types.ObjectId(user1), new Types.ObjectId(user2));

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

      res.status(200).json({ status: 200, message: 'Chat retrieved successfully', data: chat });
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

      res.status(200).json({ status: 200, message: 'Chats retrieved successfully', data: chats });
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
      const { chatId, sender, receiver, content } = req.body;

      const message = await this.chatService.createMessage(chatId, sender, receiver, content);

      res.status(200).json({ status: 200, message: 'Message created successfully', data: message });
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

      res.status(200).json({ status: 200, message: 'Messages retrieved successfully', data: messages });
    } catch (error) {
      next(error);
    }
  };
}

export default ChatController;
