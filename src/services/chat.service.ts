import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Types } from 'mongoose';
import { ChatModel, IChat, IMessage, MessageModel } from '@/models/chat.model';
import { chatSchemaValidation, messageSchemaValidation } from '@/validations/chat.validation';
import AboutService from './about.service';
import UserService from './users.service';

class ChatService {
  public chat = ChatModel;
  public message = MessageModel;
  public userService = new UserService();
  public aboutService = new AboutService();

  /*
  |--------------------------------------------------------------------------
  | Create Chat
  |--------------------------------------------------------------------------
  */
  public async createChat(user1: Types.ObjectId | string, user2: Types.ObjectId | string, milestone: Types.ObjectId | string): Promise<IChat> {
    if (isEmpty(user1) || isEmpty(user2)) {
      throw new HttpException(400, 2005, 'All required fields cannot be empty');
    }

    const { error } = chatSchemaValidation.validate({ user1, user2, milestone });

    if (error) {
      throw new HttpException(400, 2002, 'CHAT_VALIDATION_ERROR', [error.details[0].message]);
    }

    const chat: IChat = new this.chat({ user1, user2, milestone });
    await chat.save();

    return chat;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Chat By Id
  |--------------------------------------------------------------------------
  */
  public async getChatById(chatId: Types.ObjectId | string): Promise<IChat> {
    if (isEmpty(chatId)) {
      throw new HttpException(400, 2001, 'Chat id cannot be empty');
    }

    const chat: IChat | null = await this.chat.findById(chatId).exec();

    if (!chat) {
      throw new HttpException(400, 2002, 'CHAT_NOT_FOUND');
    }

    return chat;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Chats By User
  |--------------------------------------------------------------------------
  */
  public async getChatsByUser(userId: Types.ObjectId | string): Promise<IChat[]> {
    if (isEmpty(userId)) {
      throw new HttpException(400, 2001, 'User id cannot be empty');
    }

    const chats: IChat[] = await this.chat.find({ user1: userId }).exec();

    return chats;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Message
  |--------------------------------------------------------------------------
  */
  public async createMessage(data: IMessage): Promise<IMessage> {
    if (isEmpty(data)) {
      throw new HttpException(400, 2005, 'All required fields cannot be empty');
    }

    console.log(data);
    const { error } = messageSchemaValidation.validate(data);

    if (error) {
      throw new HttpException(400, 2002, 'MESSAGE_VALIDATION_ERROR', [error.details[0].message]);
    }

    const payload = {
      chat: data.chatId,
      sender: data.sender,
      content: data?.content,
    };

    const chatData: any = await this.getChatById(data.chatId.toString());
    chatData?.messages.push(payload);
    chatData?.save();

    const message: IMessage = await this.message.create(data);

    await message.save();

    return message;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Messages By Chat
  |--------------------------------------------------------------------------
  */
  public async getMessagesByChat(chatId: Types.ObjectId | string): Promise<IMessage[]> {
    const chat: IChat = await this.getChatById(chatId);

    return chat.messages;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Messages By Chat
  |--------------------------------------------------------------------------
  */
  public async getMessagesByMilestone(chatId: Types.ObjectId | string): Promise<any[]> {
    const chat: IMessage[] = await this.message.find({ milestone: chatId });

    const updatedChat: Promise<{ chat: IMessage; first_name?: string; last_name?: string; profile_picture?: string }>[] = chat.map(
      async (chatItem: IMessage) => {
        const about = await this.userService.findUserById(chatItem.sender.toString());
        return {
          chat: chatItem,
          first_name: about?.first_name,
          last_name: about?.last_name,
          profile_picture: about?.profile_picture,
        };
      },
    );

    return Promise.all(updatedChat);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Messages By Chat
  |--------------------------------------------------------------------------
  */
  public async getuserMessages(userId: Types.ObjectId | string): Promise<any[]> {
    const chat: IMessage[] = await this.message.find({ sender: userId });

    const updatedChat: Promise<{ chat: any; first_name?: string; last_name?: string; profile_picture?: string }>[] = chat.map(
      async (chatItem: IMessage) => {
        const about = await this.userService.findUserById(chatItem.sender.toString());
        const chat = await this.message.find({ milestone: chatItem.chatId.toString() });
        return {
          chat: chat,
          first_name: about?.first_name,
          last_name: about?.last_name,
          profile_picture: about?.profile_picture,
        };
      },
    );

    return Promise.all(updatedChat);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Files By Milestone
  |--------------------------------------------------------------------------
  */
  public async getFilesByMilestone(chatId: Types.ObjectId | string): Promise<any[]> {
    const chat: IMessage[] = await this.message.find({ milestone: chatId, is_file: true });

    const updatedChat: Promise<{ chat: IMessage; first_name?: string; last_name?: string; profile_picture?: string }>[] = chat.map(
      async (chatItem: IMessage) => {
        const about = await this.userService.findUserById(chatItem.sender.toString());
        return {
          chat: chatItem,
          first_name: about?.first_name,
          last_name: about?.last_name,
          profile_picture: about?.profile_picture,
        };
      },
    );

    return Promise.all(updatedChat);
  }
}

export default ChatService;
