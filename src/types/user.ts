import { UserRole } from '@src/enums/user';

export interface IUser {
  email: string;
  id: string;
  role: UserRole;
  username: string;
  verified: boolean;
}
