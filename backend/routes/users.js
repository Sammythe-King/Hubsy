import express from "express"
import { getDB } from "../db/connection.js"
import { ObjectId } from "mongodb"

const router = express.Router()

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await getDB().collection("users").find({}).toArray()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET single user
router.get("/:id", async (req, res) => {
  try {
    const user = await getDB()
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST new user
router.post("/", async (req, res) => {
  try {
    const result = await getDB().collection("users").insertOne(req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update user
router.put("/:id", async (req, res) => {
  try {
    const result = await getDB()
      .collection("users")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const result = await getDB()
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) })
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
