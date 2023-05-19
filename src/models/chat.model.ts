import { Schema, Document, model } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

// Define the Message schema
export interface IMessage extends Document {
  chat: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt: Date;
}

const messageSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

// Define the Chat schema
export interface IChat extends Document {
  user1: string;
  user2: string;
  messages: IMessage[];
}

const chatSchema: Schema = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
  },
  { versionKey: false },
);

// add plugin that converts mongoose to json
chatSchema.plugin(toJSON);
messageSchema.plugin(toJSON);

// Create and export the Chat model
const ChatModel = model<IChat>('Chat', chatSchema);
const MessageModel = model<IMessage>('Message', messageSchema);

export { ChatModel, MessageModel };
