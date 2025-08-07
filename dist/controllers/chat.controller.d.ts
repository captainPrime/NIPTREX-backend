import { NextFunction, Request, Response } from 'express';
import ChatService from '@/services/chat.service';
import UserService from '@/services/users.service';
declare class ChatController {
    userService: UserService;
    chatService: ChatService;
    createChat: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getChatById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getChatsByUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMessagesByChat: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMessagesByMilestone: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getUserMessages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFilesByMilestone: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default ChatController;
