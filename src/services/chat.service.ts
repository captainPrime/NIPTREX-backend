import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Types } from 'mongoose';
import { ChatModel, IChat, IMessage, MessageModel } from '@/models/chat.model';
import { chatSchemaValidation, messageSchemaValidation } from '@/validations/chat.validation';
import AboutService from './about.service';

class ChatService {
  public chat = ChatModel;
  public message = MessageModel;
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
  public async createMessage(chat: Types.ObjectId | string, sender: string, content: string, milestone: Types.ObjectId | string): Promise<IMessage> {
    console.log(chat);
    if (isEmpty(sender) || isEmpty(content)) {
      throw new HttpException(400, 2005, 'All required fields cannot be empty');
    }

    const { error } = messageSchemaValidation.validate({ chat, sender, content, milestone });

    if (error) {
      throw new HttpException(400, 2002, 'MESSAGE_VALIDATION_ERROR', [error.details[0].message]);
    }

    const payload = {
      chat: chat,
      sender,
      content,
      milestone,
      createdAt: new Date(),
    };

    if (chat) {
      const chatData: any = await this.getChatById(chat);
      chatData?.messages.push(payload);
      chatData?.save();
    }

    const message: IMessage = new this.message(payload);

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
        const about = await this.aboutService.getUserAbout(chatItem.sender.toString());
        return {
          chat: chatItem,
          first_name: about?.personal_details?.first_name,
          last_name: about?.personal_details?.last_name,
          profile_picture: about?.personal_details?.profile_picture,
        };
      },
    );

    return Promise.all(updatedChat);
  }
}

export default ChatService;
