import { NextFunction, Request, Response } from 'express';
import ChatService from '@/services/chat.service';
import { containsBadWords } from '@/utils/wordChecker';
import { HttpException } from '@/exceptions/HttpException';
import UserService from '@/services/users.service';

class ChatController {
  public userService = new UserService();
  public chatService = new ChatService();

  /*
  |--------------------------------------------------------------------------
  | Create Chat
  |--------------------------------------------------------------------------
  */
  public createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { participants, milestone } = req.body;

      const chat = await this.chatService.createChat(participants, milestone);

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
      const { chatId, sender, content, files }: any = req.body;

      if (content && files) {
        throw new HttpException(400, 1004, 'CANT_SEND_BOTH_FILES_AND_MESSAGE');
      }

      if (content && containsBadWords(content)) {
        throw new HttpException(400, 1004, 'BAD_WORDS_NOT_ALLOWED');
      }

      const payload: any = {
        chatId,
        sender,
        is_file: files ? true : false,
        ...(files ? { files } : { content }),
      };

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

      const dataWithUserInfo = await Promise.all(
        messages.map(async data => {
          const user = await this.userService.findUserById(data.sender.toString());
          return { data, first_name: user.first_name, last_name: user.last_name, profile_picture: user.profile_picture };
        }),
      );

      res.status(200).json({ status: 200, response_code: 6000, message: 'CHAT_REQUEST_SUCCESSFUL', data: dataWithUserInfo });
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
  | Get Messages By Chat
  |--------------------------------------------------------------------------
  */
  public getUserMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      const messages = await this.chatService.getuserMessages(userId);

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
