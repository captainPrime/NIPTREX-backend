"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const HttpException_1 = require("@exceptions/HttpException");
const util_1 = require("@utils/util");
const chat_model_1 = require("@/models/chat.model");
const chat_validation_1 = require("@/validations/chat.validation");
const about_service_1 = tslib_1.__importDefault(require("./about.service"));
const users_service_1 = tslib_1.__importDefault(require("./users.service"));
const service_service_1 = tslib_1.__importDefault(require("./service.service"));
const bid_service_1 = tslib_1.__importDefault(require("./bid.service"));
class ChatService {
    constructor() {
        this.chat = chat_model_1.ChatModel;
        this.message = chat_model_1.MessageModel;
        this.userService = new users_service_1.default();
        this.bidService = new bid_service_1.default();
        this.serviceService = new service_service_1.default();
        this.aboutService = new about_service_1.default();
    }
    /*
    |--------------------------------------------------------------------------
    | Create Chat
    |--------------------------------------------------------------------------
    */
    async createChat(participants, milestone) {
        if ((0, util_1.isEmpty)(participants)) {
            throw new HttpException_1.HttpException(400, 2005, 'All required fields cannot be empty');
        }
        const { error } = chat_validation_1.chatSchemaValidation.validate({ participants, milestone });
        if (error) {
            throw new HttpException_1.HttpException(400, 2002, 'CHAT_VALIDATION_ERROR', [error.details[0].message]);
        }
        const chat = await this.chat.create({ participants, milestone });
        await chat.save();
        return chat;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Chat By Id
    |--------------------------------------------------------------------------
    */
    async getChatById(chatId) {
        if ((0, util_1.isEmpty)(chatId)) {
            throw new HttpException_1.HttpException(400, 2001, 'Chat id cannot be empty');
        }
        const chat = await this.chat.findById(chatId).exec();
        if (!chat) {
            throw new HttpException_1.HttpException(400, 2002, 'CHAT_NOT_FOUND');
        }
        return chat;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Chat By Id
    |--------------------------------------------------------------------------
    */
    async getChatByMilestone(milestoneId) {
        if ((0, util_1.isEmpty)(milestoneId)) {
            throw new HttpException_1.HttpException(400, 2001, 'Chat id cannot be empty');
        }
        const chat = await this.chat.findOne({ milestone: milestoneId });
        console.log(chat);
        return chat;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Chats By User
    |--------------------------------------------------------------------------
    */
    async getChatsByUser(userId) {
        if ((0, util_1.isEmpty)(userId)) {
            throw new HttpException_1.HttpException(400, 2001, 'User id cannot be empty');
        }
        const chats = await this.chat
            .find({ participants: { $in: userId } })
            .sort({ createdAt: -1 })
            .lean();
        // return chats;
        // Loop through each chat and keep only the last message
        const chatsWithLastMessage = Promise.all(chats.map(async (chat) => {
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
            serviceProposal = serviceProposal_.find((proposal) => {
                return proposal.milestone_stage.some((milestone) => {
                    return chat.milestone == milestone._id.toString(); // Convert milestone._id to string for comparison
                });
            });
            console.log('CHAT', serviceProposal_);
            // Map participantsData to the required format with name and email
            const participants = participantsData.map((participant) => ({
                id: participant.id,
                last_name: participant.last_name,
                first_name: participant.first_name,
                profile_picture: participant.profile_picture,
            }));
            return Object.assign(Object.assign({}, chat), { entity: serviceProposal || serviceProposalById, messages: [lastMessage], participants });
        }));
        return chatsWithLastMessage;
    }
    /*
    |--------------------------------------------------------------------------
    | Create Message
    |--------------------------------------------------------------------------
    */
    async createMessage(data) {
        if ((0, util_1.isEmpty)(data)) {
            throw new HttpException_1.HttpException(400, 2005, 'All required fields cannot be empty');
        }
        console.log(data);
        const { error } = chat_validation_1.messageSchemaValidation.validate(data);
        if (error) {
            throw new HttpException_1.HttpException(400, 2002, 'MESSAGE_VALIDATION_ERROR', [error.details[0].message]);
        }
        const payload = {
            chatId: data.chatId,
            sender: data.sender,
            content: data === null || data === void 0 ? void 0 : data.content,
            files: data === null || data === void 0 ? void 0 : data.files,
        };
        const chatData = await this.getChatById(data.chatId.toString());
        chatData === null || chatData === void 0 ? void 0 : chatData.messages.push(payload);
        chatData === null || chatData === void 0 ? void 0 : chatData.save();
        const message = await this.message.create(data);
        await message.save();
        return message;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Messages By Chat
    |--------------------------------------------------------------------------
    */
    async getMessagesByChat(chatId) {
        const chat = await this.getChatById(chatId);
        console.log(chat);
        return chat.messages;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Messages By Chat
    |--------------------------------------------------------------------------
    */
    async getMessagesByMilestone(milestoneId) {
        const chat = await this.chat.findOne({ milestone: milestoneId });
        console.log('CHAT', chat === null || chat === void 0 ? void 0 : chat.messages);
        return chat === null || chat === void 0 ? void 0 : chat.messages;
    }
    /*
    |--------------------------------------------------------------------------
    | Get Messages By Chat
    |--------------------------------------------------------------------------
    */
    async getuserMessages(userId) {
        const chat = await this.message.find({ sender: userId });
        const updatedChat = chat.map(async (chatItem) => {
            const about = await this.userService.findUserById(chatItem.sender.toString());
            const chat = await this.message.find({ milestone: chatItem.chatId.toString() });
            return {
                chat: chat,
                first_name: about === null || about === void 0 ? void 0 : about.first_name,
                last_name: about === null || about === void 0 ? void 0 : about.last_name,
                profile_picture: about === null || about === void 0 ? void 0 : about.profile_picture,
            };
        });
        return Promise.all(updatedChat);
    }
    /*
    |--------------------------------------------------------------------------
    | Get Files By Milestone
    |--------------------------------------------------------------------------
    */
    async getFilesByMilestone(chatId) {
        const chat = await this.message.find({ milestone: chatId, is_file: true });
        const updatedChat = chat.map(async (chatItem) => {
            const about = await this.userService.findUserById(chatItem.sender.toString());
            return {
                chat: chatItem,
                first_name: about === null || about === void 0 ? void 0 : about.first_name,
                last_name: about === null || about === void 0 ? void 0 : about.last_name,
                profile_picture: about === null || about === void 0 ? void 0 : about.profile_picture,
            };
        });
        return Promise.all(updatedChat);
    }
}
exports.default = ChatService;
//# sourceMappingURL=chat.service.js.map