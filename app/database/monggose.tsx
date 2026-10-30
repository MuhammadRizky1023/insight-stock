import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL


declare global {
    var mongooseChache: {
        conn: mongoose.Mongoose | null;
        promise: Promise<mongoose.Mongoose> | null;
    };
}

let cached = global.mongooseChache;

if (!cached) {
    cached = global.mongooseChache = {
        conn: null,
        promise: null,
    };
}
export const connectToDatabase = async () => {
    if (!MONGODB_URL) {
        throw new Error("MONGODB_URL must be set within .env");
    }
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL, {
            bufferCommands: false,
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
    console.log(`Connected to database ${process.env.NODE_ENV}`);
    return cached.conn;
};