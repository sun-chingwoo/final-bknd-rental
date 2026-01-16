import express from "express"
import routes from "./routes/routes.js"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

dotenv.config()
const app = express()

// Security Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter)

connectDB()

app.use("/api", routes)

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Internal Server Error", error: err.message })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
