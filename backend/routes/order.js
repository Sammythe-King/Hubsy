import express from "express"
import { getDB } from "../db/connection.js"

const router = express.Router()

router.post("/", async (req, res) => {
    try{
        const db = getDB()
        const { name, phone, items, total } = req.body

        if(!name || !phone || !items || items.length === 0){
            return res.status(400).json({ message: "Missing order data."})
        }

        const newOrder = {
            name: name,
            phone: phone,
            lessonIds: items.map(item => item.lessonId),
            spacesBooked: items.length,
            items: items,
            total: total,
            createdAt: new Date()
        }

        const result = await db.collection("orders").insertOne(newOrder)

        res.status(201).json({ message: "Order created successfully", orderId: result.insertedId})
    }catch(err){
        console.error("Order submission error:", err)
        res.status(500).json({ message: "Failed to submit order."})
    }
})

export default router