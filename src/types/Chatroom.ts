import { User } from './User';

export interface Chatroom {
  id: string;
  topic: string;
  users?: User[];
}
