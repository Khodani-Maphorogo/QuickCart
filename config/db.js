import mongoose from "mongoose";

let canched = global.mongoose

if (!canched) {
    canched = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
    if (canched.conn) {
        return canched.conn
    }

    if (!canched.promise) {
        const opts = {
            bufferCommands: false,
        };
        canched.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        })

    }
    canched.conn = await canched.promise;
    return canched.conn;
}

export default connectDB;   