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

// Input Form Schema - NEW COLLECTION
const inputFormSchema = new mongoose.Schema({
  employment_status: {
    type: String,
    required: true,
    enum: ["student", "employed", "self_employed", "unemployed", "retired"],
  },
  monthly_income: {
    type: String,
    required: true,
    enum: ["0", "<5000", "5000-10000", ">10000"],
  },
  monthly_expenses: {
    type: String,
    required: true,
    enum: ["0", "<5000", "5000-10000", ">10000"],
  },
  goal_types: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 1 && v.length <= 3,
      message: "Must select 1-3 goal types",
    },
    enum: ["buying_house", "retirement", "education", "vacation", "emergency_fund"],
  },
  target_amount: {
    type: Number,
    required: true,
    min: 1,
  },
  target_duration: {
    type: Number,
    required: true,
    min: 1,
    max: 50,
  },
  risk_tolerance: {
    type: String,
    required: true,
    enum: ["low", "moderate", "high"],
  },
  investment_experience: {
    type: String,
    required: true,
    enum: ["beginner", "intermediate", "advanced"],
  },
  savings_investment: {
    type: String,
    required: true,
    enum: ["0", "<5000", "5000-10000", ">10000"],
  },
  existing_loans: {
    type: String,
    required: true,
    enum: ["0", "<5000", "5000-10000", ">10000"],
  },
  financial_discipline: {
    type: String,
    required: true,
    enum: ["saver", "spender", "balanced"],
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
})

// Create models
const Goal = mongoose.model("goalDB", goalSchema)
const InputForm = mongoose.model("inputForm", inputFormSchema)

// API Routes for Goals (existing)

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

// API Routes for Input Form (NEW)

// GET all input form submissions
app.get("/api/input-form", async (req, res) => {
  try {
    const submissions = await InputForm.find().sort({ submitted_at: -1 })
    res.json(submissions)
  } catch (error) {
    console.error("Error fetching input form submissions:", error)
    res.status(500).json({ message: "Error fetching submissions", error: error.message })
  }
})

// POST create new input form submission
app.post("/api/input-form", async (req, res) => {
  try {
    const {
      employment_status,
      monthly_income,
      monthly_expenses,
      goal_types,
      target_amount,
      target_duration,
      risk_tolerance,
      investment_experience,
      savings_investment,
      existing_loans,
      financial_discipline,
    } = req.body

    // Validation
    if (
      !employment_status ||
      !monthly_income ||
      !monthly_expenses ||
      !goal_types ||
      !target_amount ||
      !target_duration ||
      !risk_tolerance ||
      !investment_experience ||
      !savings_investment ||
      !existing_loans ||
      !financial_discipline
    ) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    if (!Array.isArray(goal_types) || goal_types.length < 1 || goal_types.length > 3) {
      return res.status(400).json({
        message: "Must select 1-3 goal types",
      })
    }

    const newSubmission = new InputForm({
      employment_status,
      monthly_income,
      monthly_expenses,
      goal_types,
      target_amount: Number.parseInt(target_amount),
      target_duration: Number.parseInt(target_duration),
      risk_tolerance,
      investment_experience,
      savings_investment,
      existing_loans,
      financial_discipline,
    })

    const savedSubmission = await newSubmission.save()
    res.status(201).json({
      message: "Financial profile submitted successfully",
      data: savedSubmission,
    })
  } catch (error) {
    console.error("Error creating input form submission:", error)
    res.status(400).json({ message: "Error submitting form", error: error.message })
  }
})

// GET specific input form submission
app.get("/api/input-form/:id", async (req, res) => {
  try {
    const submission = await InputForm.findById(req.params.id)
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" })
    }
    res.json(submission)
  } catch (error) {
    console.error("Error fetching submission:", error)
    res.status(500).json({ message: "Error fetching submission", error: error.message })
  }
})

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "Goal_Based_Investment_Planning.html"))
})

// Serve the input form page
app.get("/input-form", (req, res) => {
  res.sendFile(path.join(__dirname, "input_form.html"))
})

// Basic API info route
app.get("/api", (req, res) => {
  res.json({ message: "5NANCE API is running!" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📁 Serving frontend files from: ${path.join(__dirname, "frontend")}`)
  console.log(`📝 Input form available at: http://localhost:${PORT}/input-form`)
})
