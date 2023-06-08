import { NextFunction, Request, Response } from 'express';
import ChatService from '@/services/chat.service';
import { containsBadWords } from '@/utils/wordChecker';
import { HttpException } from '@/exceptions/HttpException';
import { IMessage } from '@/models/chat.model';

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
    const { milestone, sender, content, files }: any = req.body;
    try {
      if (req.body.content && req.body.files) throw new HttpException(400, 1004, 'CANT_SEND_BOTH_FILES_AND_MESSAGE');

      if (req.body.content && containsBadWords(req.body.content)) throw new HttpException(400, 1004, 'BAD_WORDS_NOT_ALLOWED');

      let payload: any;

      if (req.body.files) {
        payload = {
          milestone,
          sender,
          files,
          is_file: true,
        };
      } else {
        payload = {
          milestone,
          sender,
          content,
          is_file: false,
        };
      }
      const message = await this.chatService.createMessage(payload);

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

  /*
  |--------------------------------------------------------------------------
  | Get Files By Milestone
  |--------------------------------------------------------------------------
  */
  public getFilesByMilestone = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chatId = req.params.id;

      const messages = await this.chatService.getFilesByMilestone(chatId);

      res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: messages });
    } catch (error) {
      next(error);
    }
  };
}

export default ChatController;
