import { RefreshTokenModel, IRefreshToken } from '../models/RefreshToken';
import { Types } from 'mongoose';

export class MongoTokenRepository {
  async storeRefreshToken(token: { userId: Types.ObjectId; jti: string; expiresAt: Date }): Promise<IRefreshToken> {
    return RefreshTokenModel.create(token);
  }

  async exists(jti: string): Promise<boolean> {
    return !!(await RefreshTokenModel.findOne({ jti }));
  }

  async removeByJti(jti: string): Promise<void> {
    await RefreshTokenModel.deleteOne({ jti });
  }

  async removeAllForUser(userId: Types.ObjectId): Promise<void> {
    await RefreshTokenModel.deleteMany({ userId });
  }
}
