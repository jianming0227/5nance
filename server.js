const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "frontend")))

// MongoDB Atlas Connection (removed deprecated options)
const mongoURI =
  "mongodb+srv://admin:5Nance2025@financialcluster.om5z5pu.mongodb.net/investmentDB?retryWrites=true&w=majority"

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas")
  })
  .catch((err) => {
    console.error("❌ Connection error:", err)
  })

// Goal Schema - Updated to match your frontend structure
const goalSchema = new mongoose.Schema({
  username: {
    type: String,
    default: "guest",
  },
  name: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  targetDate: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    default: 1,
  },
  description: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    required: true,
    enum: ["retirement", "housing", "education", "travel", "emergency", "other"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create model
const Goal = mongoose.model("goalDB", goalSchema)

// API Routes

// GET all goals
app.get("/api/goals", async (req, res) => {
  try {
    const username = req.query.username || "guest"
    const goals = await Goal.find({ username }).sort({ priority: 1 })
    res.json(goals)
  } catch (error) {
    console.error("Error fetching goals:", error)
    res.status(500).json({ message: "Error fetching goals", error: error.message })
  }
})

// POST create new goal
app.post("/api/goals", async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, targetDate, description, category, username } = req.body

    // Get the highest priority to set new goal at the end
    const highestPriorityGoal = await Goal.findOne({ username: username || "guest" }).sort({ priority: -1 })
    const newPriority = highestPriorityGoal ? highestPriorityGoal.priority + 1 : 1

    const newGoal = new Goal({
      username: username || "guest",
      name,
      targetAmount: Number.parseFloat(targetAmount),
      currentAmount: Number.parseFloat(currentAmount) || 0,
      targetDate,
      description: description || "",
      category,
      priority: newPriority,
    })

    const savedGoal = await newGoal.save()
    res.status(201).json(savedGoal)
  } catch (error) {
    console.error("Error creating goal:", error)
    res.status(400).json({ message: "Error creating goal", error: error.message })
  }
})

// PUT update goal
app.put("/api/goals/:id", async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, targetDate, description, category } = req.body

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      {
        name,
        targetAmount: Number.parseFloat(targetAmount),
        currentAmount: Number.parseFloat(currentAmount),
        targetDate,
        description,
        category,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true },
    )

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    res.json(updatedGoal)
  } catch (error) {
    console.error("Error updating goal:", error)
    res.status(400).json({ message: "Error updating goal", error: error.message })
  }
})

// PATCH add savings to goal
app.patch("/api/goals/:id/add-savings", async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" })
    }

    const goal = await Goal.findById(req.params.id)
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    goal.currentAmount += Number.parseFloat(amount)
    goal.updatedAt = Date.now()

    const updatedGoal = await goal.save()
    res.json(updatedGoal)
  } catch (error) {
    console.error("Error adding savings:", error)
    res.status(400).json({ message: "Error adding savings", error: error.message })
  }
})

// PATCH update goal priorities (for reordering)
app.patch("/api/goals/reorder", async (req, res) => {
  try {
    const { goalIds } = req.body
    const username = req.query.username || "guest"

    if (!Array.isArray(goalIds)) {
      return res.status(400).json({ message: "goalIds must be an array" })
    }

    // Update priorities based on array order
    const updatePromises = goalIds.map((goalId, index) =>
      Goal.findByIdAndUpdate(goalId, { priority: index + 1, updatedAt: Date.now() }),
    )

    await Promise.all(updatePromises)

    // Return updated goals
    const goals = await Goal.find({ username }).sort({ priority: 1 })
    res.json(goals)
  } catch (error) {
    console.error("Error reordering goals:", error)
    res.status(400).json({ message: "Error reordering goals", error: error.message })
  }
})

// DELETE goal
app.delete("/api/goals/:id", async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id)

    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    // Reorder remaining goals
    const remainingGoals = await Goal.find({ username: deletedGoal.username }).sort({ priority: 1 })
    const updatePromises = remainingGoals.map((goal, index) =>
      Goal.findByIdAndUpdate(goal._id, { priority: index + 1 }),
    )
    await Promise.all(updatePromises)

    res.json({ message: "Goal deleted successfully", goal: deletedGoal })
  } catch (error) {
    console.error("Error deleting goal:", error)
    res.status(500).json({ message: "Error deleting goal", error: error.message })
  }
})

// REMOVED: Initialize with sample data endpoint
// Users will now start with no goals

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "Goal_Based_Investment_Planning.html"))
})

// Basic API info route
app.get("/api", (req, res) => {
  res.json({ message: "5NANCE API is running!" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📁 Serving frontend files from: ${path.join(__dirname, "frontend")}`)
})
