import { Routes } from '@interfaces/routes.interface';
import ChatController from '@/controllers/chat.controller';
declare class ChatRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    chatController: ChatController;
    constructor();
    private initializeRoutes;
}
export default ChatRoute;
