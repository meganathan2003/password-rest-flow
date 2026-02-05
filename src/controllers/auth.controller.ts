import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/User";
import { transporter } from "../config/mail";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();



// Create a new method for forget password
export const forgotPassword = async (req: Request, res: Response) => {

    const { email } = req.body;

    const user = await User.findOne({ email });


    // security reason
    if (!user) {
        return res.status(200).json({ message: "If that email address is in our database, we will send you an email to reset your password." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    //  to save token and expiry time to DB
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`; // to send to user

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
    });

    console.log("link is sent");
    

    res.status(200).json({ message: "If that email address is in our database, we will send you an email to reset your password." });

};


// Verify token and reset password
export const verifyResetToken = async (req: Request, res: Response) => {

    const { token } = req.query;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
    });


    if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.status(200).json({ message: "Token is valid" });
};


// reset password
export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }

    // if token is valid, update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
}