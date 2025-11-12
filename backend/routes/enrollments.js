import express from "express"
import { getDB } from "../db/connection.js"
import { ObjectId } from "mongodb"

const router = express.Router()

// GET all enrollments
router.get("/", async (req, res) => {
  try {
    const enrollments = await getDB().collection("enrollments").find({}).toArray()
    res.json(enrollments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET enrollments for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const enrollments = await getDB()
      .collection("enrollments")
      .find({ user_id: new ObjectId(req.params.userId) })
      .toArray()
    res.json(enrollments)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST new enrollment
router.post("/", async (req, res) => {
  try {
    const result = await getDB().collection("enrollments").insertOne(req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE enrollment
router.delete("/:id", async (req, res) => {
  try {
    const result = await getDB()
      .collection("enrollments")
      .deleteOne({ _id: new ObjectId(req.params.id) })
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
