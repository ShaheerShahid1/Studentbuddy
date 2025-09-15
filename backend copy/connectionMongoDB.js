import mongoose from "mongoose";

export async function connectMongoDb(url){
    return mongoose.connect(url);
}

export default connectMongoDb;