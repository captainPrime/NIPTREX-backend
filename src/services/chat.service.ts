import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import mongoose, { Types } from 'mongoose';
import { Chat, Message } from '@/models/chat.model';
import { chatSchemaValidation, messageSchemaValidation } from '@/validations/chat.validation';

class ChatService {
  public chatModel = Chat;

  /*
  |--------------------------------------------------------------------------
  | Create Chat
  |--------------------------------------------------------------------------
  */
  public async createChat(user1: string, user2: string): Promise<Chat> {
    if (isEmpty(user1) || isEmpty(user2)) {
      throw new HttpException(400, 2005, 'All required fields cannot be empty');
    }

    const { error } = chatSchemaValidation.validate({ user1, user2 });

    if (error) {
      throw new HttpException(400, 2002, 'CHAT_VALIDATION_ERROR', [error.details[0].message]);
    }

    const chat: Chat = new this.chatModel({ user1, user2 });
    await chat.save();

    return chat;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Chat By Id
  |--------------------------------------------------------------------------
  */
  public async getChatById(chatId: Types.ObjectId | string): Promise<Chat> {
    if (isEmpty(chatId)) {
      throw new HttpException(400, 2001, 'Chat id cannot be empty');
    }

    const chat: Chat | null = await this.chatModel.findById(chatId).exec();

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
  public async getChatsByUser(userId: Types.ObjectId | string): Promise<Chat[]> {
    if (isEmpty(userId)) {
      throw new HttpException(400, 2001, 'User id cannot be empty');
    }

    const chats: Chat[] = await this.chatModel
      .find({
        $or: [{ user1: userId }, { user2: userId }],
      })
      .exec();

    return chats;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Message
  |--------------------------------------------------------------------------
  */
  public async createMessage(chatId: Types.ObjectId | string, sender: string, receiver: string, content: string): Promise<Message> {
    if (isEmpty(chatId) || isEmpty(sender) || isEmpty(receiver) || isEmpty(content)) {
      throw new HttpException(400, 2005, 'All required fields cannot be empty');
    }

    const { error } = messageSchemaValidation.validate({ sender, receiver, content });

    if (error) {
      throw new HttpException(400, 2002, 'MESSAGE_VALIDATION_ERROR', [error.details[0].message]);
    }

    const chat: Chat = await this.getChatById(chatId);

    const message: Message = {
      sender,
      receiver,
      content,
      createdAt: new Date(),
    };

    chat.messages.push(message);
    await chat.save();

    return message;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Messages By Chat
  |--------------------------------------------------------------------------
  */
  public async getMessagesByChat(chatId: Types.ObjectId | string): Promise<Message[]> {
    const chat: Chat = await this.getChatById(chatId);

    return chat.messages;
  }
}

export default ChatService;
