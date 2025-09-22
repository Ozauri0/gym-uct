import { UserModel, IUser } from '../models/User';
import { Types } from 'mongoose';

export class MongoUserRepository {
  async create(user: { email: string; passwordHash: string; name: string }): Promise<IUser> {
    return UserModel.create(user);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return UserModel.findById(id);
  }
}
