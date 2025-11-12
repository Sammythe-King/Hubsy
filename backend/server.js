import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./db/connection.js"
import lessonsRouter from "./routes/lessons.js"
import usersRouter from "./routes/users.js"
import enrollmentsRouter from "./routes/enrollments.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

connectDB()
  .then(() => {
    // Routes
    app.use("/api/lessons", lessonsRouter)
    app.use("/api/users", usersRouter)
    app.use("/api/enrollments", enrollmentsRouter)

    // Error route
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" })
    })

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Failed to start server:", err)
    process.exit(1)
  })
