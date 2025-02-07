export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
