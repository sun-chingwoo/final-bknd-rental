import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const testConnection = async () => {
    if (!process.env.MONGO_URI) {
        console.error("❌ Error: MONGO_URI is not defined in .env");
        process.exit(1);
    }

    console.log("🔄 Testing MongoDB Connection...");
    console.log(`📡 URI: ${process.env.MONGO_URI.split("@")[1] || "Hidden"}`); // Safe logging

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ SUCCESS: Connected to MongoDB Atlas!");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("📂 Collections found:", collections.map(c => c.name));

    } catch (error) {
        console.error("❌ CONNECTION FAILED:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected.");
    }
};

testConnection();
