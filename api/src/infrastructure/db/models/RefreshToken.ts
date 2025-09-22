import { Schema, model, Document, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  jti: string;
  expiresAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jti: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const RefreshTokenModel = model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
