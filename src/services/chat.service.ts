import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Types } from 'mongoose';
import { ChatModel, IChat, IMessage, MessageModel } from '@/models/chat.model';
import { chatSchemaValidation, messageSchemaValidation } from '@/validations/chat.validation';

class ChatService {
  public chat = ChatModel;
  public message = MessageModel;

  /*
  |--------------------------------------------------------------------------
  | Create Chat
  |--------------------------------------------------------------------------
  */
  public async createChat(user1: Types.ObjectId | string, user2: Types.ObjectId | string): Promise<IChat> {
    if (isEmpty(user1) || isEmpty(user2)) {
      throw new HttpException(400, 2005, 'All required fields cannot be empty');
    }

    const { error } = chatSchemaValidation.validate({ user1, user2 });

    if (error) {
      throw new HttpException(400, 2002, 'CHAT_VALIDATION_ERROR', [error.details[0].message]);
    }

    const chat: IChat = new this.chat({ user1, user2 });
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
  public async createMessage(chatId: Types.ObjectId | string, sender: string, receiver: string, content: string): Promise<IMessage> {
    if (isEmpty(chatId) || isEmpty(sender) || isEmpty(receiver) || isEmpty(content)) {
      throw new HttpException(400, 2005, 'All required fields cannot be empty');
    }

    const { error } = messageSchemaValidation.validate({ sender, receiver, content });

    if (error) {
      throw new HttpException(400, 2002, 'MESSAGE_VALIDATION_ERROR', [error.details[0].message]);
    }

    const chat: IChat = await this.getChatById(chatId);

    const message: IMessage = new this.message({
      chat: chat._id,
      sender,
      receiver,
      content,
      createdAt: new Date(),
    });

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
}

export default ChatService;
