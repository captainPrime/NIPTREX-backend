import { Schema, Document, model } from 'mongoose';
import { toJSON } from '@/modules/toJSON';

// Define the Message schema

export interface IFiles {
  name?: string;
  url?: string;
}
export interface IMessage extends Document {
  sender: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  content?: string;
  is_file: boolean;
  files?: IFiles[];
  created_at?: Date;
}

const messageSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    content: {
      type: String,
      required: false,
    },
    is_file: { type: Boolean, required: true, default: false },
    files: [
      {
        name: {
          type: String,
          required: function (this: IMessage) {
            return this.is_file;
          },
        },
        url: {
          type: String,
          required: function (this: IMessage) {
            return this.is_file;
          },
        },
      },
    ],
    created_at: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

// Define the Chat schema
export interface IChat extends Document {
  participants: string[];
  milestone: string;
  messages: IMessage[];
}

const chatSchema: Schema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
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
