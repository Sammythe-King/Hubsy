import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./db/connection.js"
import lessonsRouter from "./routes/lessons.js"
import usersRouter from "./routes/users.js"
import enrollmentsRouter from "./routes/enrollments.js"
import ordersRouter from "./routes/order.js"
import path from "path"
import fs from "fs/promises"
import { fileURLToPath } from "url"

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.url}`)
  next()
})

app.use(cors())
app.use(express.json())

const staticImagePath = path.join(__dirname, 'public', 'images')

app.use('/images', async (req,res,next) => {
  const filePath = path.join(staticImagePath, req.url)

  try{
    await fs.access(filePath)
    next()
  }catch(err){
    console.error(`Image access failed for: ${req.url}`)
    res.status(404).json({ message: `Error: Image file does not exist on the server for ${req.url}` })
  }
});
app.use('/images', express.static(staticImagePath));

connectDB()
  .then(() => {
    // Routes
    app.use("/api/lessons", lessonsRouter)
    app.use("/api/users", usersRouter)
    app.use("/api/enrollments", enrollmentsRouter)
    app.use("/api/orders", ordersRouter)

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
