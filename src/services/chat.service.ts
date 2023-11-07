import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Types } from 'mongoose';
import { ChatModel, IChat, IMessage, MessageModel } from '@/models/chat.model';
import { chatSchemaValidation, messageSchemaValidation } from '@/validations/chat.validation';
import AboutService from './about.service';
import UserService from './users.service';
import ServiceService from './service.service';
import BidService from './bid.service';

class ChatService {
  public chat = ChatModel;
  public message = MessageModel;
  public userService = new UserService();
  public bidService = new BidService();
  public serviceService = new ServiceService();
  public aboutService = new AboutService();

  /*
  |--------------------------------------------------------------------------
  | Create Chat
  |--------------------------------------------------------------------------
  */
  public async createChat(participants: Types.ObjectId | string, milestone: Types.ObjectId | string): Promise<IChat> {
    if (isEmpty(participants)) {
      throw new HttpException(400, 2005, 'All required fields cannot be empty');
    }

    const { error } = chatSchemaValidation.validate({ participants, milestone });

    if (error) {
      throw new HttpException(400, 2002, 'CHAT_VALIDATION_ERROR', [error.details[0].message]);
    }

    const chat: IChat = await this.chat.create({ participants, milestone });
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
  | Get Chat By Id
  |--------------------------------------------------------------------------
  */
  public async getChatByMilestone(milestoneId: Types.ObjectId | string): Promise<any> {
    if (isEmpty(milestoneId)) {
      throw new HttpException(400, 2001, 'Chat id cannot be empty');
    }

    const chat: IChat | null = await this.chat.findOne({ milestone: milestoneId });

    console.log(chat);

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

    const chats: IChat[] = await this.chat.find({ participants: { $in: userId } }).lean();

    // Loop through each chat and keep only the last message
    const chatsWithLastMessage: Promise<any[]> = Promise.all(
      chats.map(async chat => {
        const lastMessage = chat.messages[chat.messages.length - 1];

        const participantIds = chat.participants.map(String);

        console.log(chat, 'CHAT');
        // Fetch participant data from UserService
        const participantsData = await this.userService.findUserByIds(participantIds);

        // Initialize serviceProposal as null
        let serviceProposal = null;

        // Fetch participant data from UserService
        const serviceProposalById = await this.serviceService.getServiceProposalByIdInternal(chat.milestone.toString());

        const serviceProposal_ = await this.bidService.getAllProposal();

        // Find a service proposal that matches any of the milestone IDs in chat.milestone
        serviceProposal = serviceProposal_.find((proposal: any) => {
          return proposal.milestone_stage.some((milestone: any) => {
            return chat.milestone == milestone._id.toString(); // Convert milestone._id to string for comparison
          });
        });

        console.log('CHAT', serviceProposal_);
        // Map participantsData to the required format with name and email
        const participants = participantsData.map((participant: any) => ({
          id: participant.id,
          last_name: participant.last_name,
          first_name: participant.first_name,
          profile_picture: participant.profile_picture,
        }));

        return { ...chat, entity: serviceProposal || serviceProposalById, messages: [lastMessage], participants };
      }),
    );

    return chatsWithLastMessage;
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
      chatId: data.chatId,
      sender: data.sender,
      content: data?.content,
      files: data?.files,
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

    console.log(chat);

    return chat.messages;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Messages By Chat
  |--------------------------------------------------------------------------
  */
  public async getMessagesByMilestone(milestoneId: Types.ObjectId | string): Promise<IMessage[] | any> {
    const chat: IChat | null = await this.chat.findOne({ milestone: milestoneId });
    console.log('CHAT', chat?.messages);
    return chat?.messages;
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
