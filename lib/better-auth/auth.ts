import { connectToDatabase } from "@/app/database/monggose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

export const getAuth = async () => {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error("MongoDB connection not found");
    }
    return betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            requireEmailVerification: false,
            autoSignIn: true
        },
        plugins: [nextCookies()]
    });
};

export const auth = await getAuth();