import mongoose, { Schema, Document } from 'mongoose';

// Define the Message schema
export interface Message extends Document {
  sender: string;
  receiver: string;
  content: string;
  createdAt: Date;
}

const messageSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

// Define the Chat schema
export interface Chat extends Document {
  user1: string;
  user2: string;
  messages: Message[];
}

const chatSchema: Schema = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
  },
  { versionKey: false },
);

// Create and export the Chat model
export default mongoose.model<Chat>('Chat', chatSchema);
