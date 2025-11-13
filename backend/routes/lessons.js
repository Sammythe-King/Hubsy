import express from "express"
import { getDB } from "../db/connection.js"
import { ObjectId } from "mongodb"

const router = express.Router()

// GET all lessons
router.get("/", async (req, res) => {
  try {
    const lessons = await getDB().collection("lessons").find({}).toArray()
    res.json(lessons)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET single lesson
router.get("/:id", async (req, res) => {
  try {
    const lesson = await getDB()
      .collection("lessons")
      .findOne({ _id: req.params.id })
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" })
    }
    res.json(lesson)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// POST new lesson
router.post("/", async (req, res) => {
  try {
    const result = await getDB().collection("lessons").insertOne(req.body)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update lesson
router.put("/:id", async (req, res) => {
  try {
    const result = await getDB()
      .collection("lessons")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE lesson
router.delete("/:id", async (req, res) => {
  try {
    const result = await getDB()
      .collection("lessons")
      .deleteOne({ _id: new ObjectId(req.params.id) })
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
