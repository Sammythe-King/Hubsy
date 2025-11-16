import express from "express"
import { getDB } from "../db/connection.js"

// import { ObjectId } from "mongodb"

const router = express.Router()

// GET all users
router.post("/register", async (req,res) => {
  try{
    const db = getDB()
    const {firstName, lastName, email, role, password} = req.body

    const existingUser = await db.collection("users").findOne({ email:email})
    if(existingUser){
      return res.status(400).json({message: "An account with this email already exists"})
    }

    const newUser = {
      name: `${firstName} ${lastName}`,
      email: email,
      password: password,
      role: role,
      created_at: new Date()


    }

    const result = await db.collection("users").insertOne(newUser)

    res.status(201).json({
      _id: result.insertedId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    })
  }catch(err){
    console.error("Registration error:", err)
    res.status(500).json({message: "Failed to register user."})
  }
})

// the part fr user login
router.post("/login", async (req, res) => {
  try {
    const db = getDB()
    const { email, password } = req.body

    // 1. Find the user by their email
    const user = await db.collection("users").findOne({ email: email })
    
    if (!user) {
      // User not found
      return res.status(401).json({ message: "Invalid email or password." })
    }

    // 2. Compare the plain password from the form with the plain password in the database
    if (password === user.password) {
      // --- SUCCESS! ---
      // Passwords match. Send back the user's data.
      // IMPORTANT: NEVER send back the password.
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    } else {
      // --- FAILURE ---
      // Passwords do not match
      return res.status(401).json({ message: "Invalid email or password." })
    }

  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ message: "Failed to log in." })
  }
})

// GET all users (from your original file, good for testing)
router.get("/", async (req, res) => {
  try {
    const users = await getDB().collection("users").find({}).toArray()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
