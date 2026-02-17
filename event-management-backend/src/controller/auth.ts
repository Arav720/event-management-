import {type Request,type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.ts";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
            token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            })
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            success: true,
            message: "Signed in",
            user,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }

}


