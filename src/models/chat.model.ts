import { Schema, Document, model } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

// Define the Message schema
export interface IMessage extends Document {
  sender: string;
  content?: string;
  milestone: string;
  is_file: boolean;
  files?: string[]; // Updated to an array of strings for storing multiple files
  createdAt: Date;
}

const messageSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    milestone: { type: Schema.Types.ObjectId, ref: 'Bid', required: true },
    content: { type: String }, // Removed the "required" constraint for content
    is_file: { type: Boolean, required: true, default: false },
    files: [{ type: String }], // Updated to an array of strings for storing multiple files
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

// Define the Chat schema
export interface IChat extends Document {
  user1: string;
  user2: string;
  milestone: string;
  messages: IMessage[];
}

const chatSchema: Schema = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    milestone: { type: Schema.Types.ObjectId, ref: 'Bid', required: true },
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
