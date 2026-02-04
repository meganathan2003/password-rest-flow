import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

const User = model<IUser>("User", userSchema);

export default User;
