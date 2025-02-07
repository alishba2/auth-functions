import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define the user interface
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    isVerified: boolean;
    verificationToken?: string;
}

// Create the schema
const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, required: true },
});

// ✅ Hash password before saving (only if modified)
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ✅ Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Export the model
export const User = mongoose.model<IUser>("User", UserSchema);
