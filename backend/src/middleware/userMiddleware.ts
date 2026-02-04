import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export default async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        // Getting the access token
        const accessToken = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.AccessToken;

        // Debug: Log the token and secret being used
        console.log("Token received:", accessToken);
        console.log("Secret being used:", process.env.ACCESS_TOKEN_SECRET);

        if (!accessToken) {
            return res.status(401).json({ msg: "No access token provided" });
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            console.error("ACCESS_TOKEN_SECRET is not defined!");
            return res.status(500).json({ msg: "Server configuration error" });
        }

        // Decode without verifying first to see what's inside
        const decoded = jwt.decode(accessToken);
        console.log("Decoded token (without verify):", decoded);

        // Now verify
        const decodeInfo = jwt.verify(accessToken, secret);

        if (!decodeInfo) {
            return res.status(400).json({ msg: "Info is not being decoded" });
        }
        const user = await User.findById(decodeInfo._id);
        if (!user) {
            return res.status(404).json({ msg: "User is not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}