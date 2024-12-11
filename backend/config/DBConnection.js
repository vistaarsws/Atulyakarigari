import mongoose from "mongoose"
import "dotenv/config"
const DB_URL = process.env.DB_URL
const dbConnection = async () => {
    try {
        await mongoose.connect(DB_URL)
        
    } catch (error) {
        console.log("issue with db connection", error);
        process.exit(1);
    }
}
export default dbConnection