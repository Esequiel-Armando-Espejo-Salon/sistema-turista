import mongoose from "mongoose";
import colors from 'colors'
import dotenv from 'dotenv'
dotenv.config()

export const ConnectionDB = async () => {
    try {
        const url = process.env.MONGODB_URI
        const { connection } = await mongoose.connect(url!)
        const conn = `${connection.host} - ${connection.port}`
        console.log(colors.green.bold(`Succesful connection to ${conn}`))
    } catch (e: any) {
        console.log(colors.red.bold(e))
        process.exit(1)
    }
};

