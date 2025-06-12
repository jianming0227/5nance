require('dotenv').config();
console.log("🧪 PYTHON_PATH from .env:", process.env.PYTHON_PATH);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // Add this line
const nodemailer = require('nodemailer'); // Add this line
const passport = require('passport');
// Models
const User = require('./models/user');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
require('./config/passport')(passport);


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, '5nance-frontend'))); // Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // maxAge: 30 * 60 * 1000, // 30 minutes
    maxAge: 90 * 1000, // 1 minute 30 seconds (for demo)
    secure: false // true if using HTTPS
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/sign-up.html'
}), (req, res) => {
  res.redirect(`/google-redirect.html?userId=${req.user._id}`); // Redirect after successful login
});


//Forgot Password feature
// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tanyeefong20040921@gmail.com', // Replace with your Gmail address
    pass: 'ijqs omfo rtos hwoo'     // Replace with your Gmail app password
  }
});

// Add this to test the transporter
transporter.verify(function (error, success) {
  if (error) {
    console.log('Transporter error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});


// Middleware
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({ extended: true }));  // Add this line to handle form data


//Prevent cache to ensure session-check works properly
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});


app.use((req, res, next) => {
  if (!req.session || !req.session.user) {
    return next(); // Don't touch session unless logged in
  }

  const now = Date.now();

  if (req.session.timedOutAt) {
    return next(); // Grace period: no updates
  }

  const inactiveTime = now - (req.session.lastActivity || now);
  if (inactiveTime > 60 * 1000) {
    req.session.timedOutAt = now;
  } else {
    req.session.lastActivity = now;
    req.session.touch();
  }

  next();
});


const financialFormRoutes = require("./routes/financialFormRoutes")
app.use("/api", financialFormRoutes)


// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "frontend")))
app.use('/api', authRoutes);
app.use('/api', userRoutes);

//Serve login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "log-in-page.html"));
});

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
  userId: { //Goal_Based_Investment_Planning feature
    type: String,
    required: true,
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

//Goal_Based_Investment_Planning feature
// GET all goals
app.get("/api/goals", async (req, res) => {
  try {
    const userId = req.query.userId  // Changed from username to userId
    if (!userId) {
      return res.status(400).json({ message: "userId is required" })
    }
    const goals = await Goal.find({ userId }).sort({ priority: 1 })
    res.json(goals)
  } catch (error) {
    console.error("Error fetching goals:", error)
    res.status(500).json({ message: "Error fetching goals", error: error.message })
  }
})

//Goal_Based_Investment_Planning feature
// POST create new goal
app.post("/api/goals", async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, targetDate, description, category, userId } = req.body  // Changed from username to userId

    if (!userId) {
      return res.status(400).json({ message: "userId is required" })
    }

    // Get the highest priority to set new goal at the end
    const highestPriorityGoal = await Goal.findOne({ userId }).sort({ priority: -1 })
    const newPriority = highestPriorityGoal ? highestPriorityGoal.priority + 1 : 1

    const newGoal = new Goal({
      userId,  // Changed from username to userId
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

//Goal_Based_Investment_Planning feature
// PATCH update goal priorities (for reordering)
app.patch("/api/goals/reorder", async (req, res) => {
  try {
    const { goalIds } = req.body;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!Array.isArray(goalIds) || goalIds.length === 0) {
      return res.status(400).json({ message: "goalIds must be a non-empty array" });
    }

    // Get all goals for this user
    const userGoals = await Goal.find({ userId });

    // Verify all goalIds belong to this user
    const validGoalIds = userGoals.map(goal => goal._id.toString());
    const invalidIds = goalIds.filter(id => !validGoalIds.includes(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({ message: "Some goals do not belong to the user" });
    }

    // Update priorities based on array order
    const updatePromises = goalIds.map((goalId, index) =>
      Goal.findByIdAndUpdate(
        goalId,
        { priority: index + 1, updatedAt: Date.now() },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Return updated goals
    const updatedGoals = await Goal.find({ userId }).sort({ priority: 1 });
    res.json(updatedGoals);
  } catch (error) {
    console.error("Error reordering goals:", error);
    res.status(500).json({ message: "Error reordering goals", error: error.message });
  }
});

// PATCH move goal up
app.patch("/api/goals/:id/move-up", async (req, res) => {
  try {
    const { userId } = req.body;
    const goalId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Get all goals for this user
    const goals = await Goal.find({ userId }).sort({ priority: 1 });

    // Find the current goal's index
    const currentIndex = goals.findIndex(g => g._id.toString() === goalId);

    if (currentIndex <= 0) {
      return res.status(400).json({ message: "Goal is already at the top" });
    }

    // Swap priorities with the goal above
    const currentGoal = goals[currentIndex];
    const goalAbove = goals[currentIndex - 1];

    // Update priorities
    await Goal.findByIdAndUpdate(currentGoal._id, { priority: goalAbove.priority });
    await Goal.findByIdAndUpdate(goalAbove._id, { priority: currentGoal.priority });

    // Get updated goals
    const updatedGoals = await Goal.find({ userId }).sort({ priority: 1 });
    res.json(updatedGoals);
  } catch (error) {
    console.error("Error moving goal up:", error);
    res.status(500).json({ message: "Error moving goal up", error: error.message });
  }
});

// PATCH move goal down
app.patch("/api/goals/:id/move-down", async (req, res) => {
  try {
    const { userId } = req.body;
    const goalId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Get all goals for this user
    const goals = await Goal.find({ userId }).sort({ priority: 1 });

    // Find the current goal's index
    const currentIndex = goals.findIndex(g => g._id.toString() === goalId);

    if (currentIndex === -1 || currentIndex >= goals.length - 1) {
      return res.status(400).json({ message: "Goal is already at the bottom" });
    }

    // Swap priorities with the goal below
    const currentGoal = goals[currentIndex];
    const goalBelow = goals[currentIndex + 1];

    // Update priorities
    await Goal.findByIdAndUpdate(currentGoal._id, { priority: goalBelow.priority });
    await Goal.findByIdAndUpdate(goalBelow._id, { priority: currentGoal.priority });

    // Get updated goals
    const updatedGoals = await Goal.find({ userId }).sort({ priority: 1 });
    res.json(updatedGoals);
  } catch (error) {
    console.error("Error moving goal down:", error);
    res.status(500).json({ message: "Error moving goal down", error: error.message });
  }
});

// DELETE goal
app.delete("/api/goals/:id", async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id)

    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found" })
    }

    // Reorder remaining goals
    const remainingGoals = await Goal.find({ userId: deletedGoal.userId }).sort({ priority: 1 })
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

// Import and use routes (stratgies)

const strategiesRoute = require('./routes/strategyRoutes'); // ✅ THIS LINE WAS MISSING

app.use('/api', strategiesRoute);

// Import and use routes (fetching user preferences)
const financialProfileRoutes = require('./routes/financialProfileRoutes');
app.use(financialProfileRoutes);

// Import and use routes (AI prediction)
const predictRoute = require('./routes/predict');
app.use('/api', predictRoute);

//Import and use routes (Customize prediction)
const customizeRoutes = require('./routes/predict'); // Adjust path if needed
app.use('/api', customizeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📁 Serving frontend files from: ${path.join(__dirname, "frontend")}`)
  console.log(`📝 Input form available at: http://localhost:${PORT}/input-form`)
})

//Reset Password feature
// Verify current password
app.post("/api/users/:userId/verify-password", async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords (assuming you're using bcrypt for password hashing)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    res.json({ message: "Password verified successfully" });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ message: "Error verifying password" });
  }
});

// Reset password
app.patch("/api/users/:userId/reset-password", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

//Forgot Password feature
// Check if email exists
app.post("/api/users/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json({ message: "Email found" });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Error checking email" });
  }
});

// Send verification code
app.post("/api/users/send-verification-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log('Attempting to send code to:', email); // Debug log

    // Email content
    const mailOptions = {
      from: '"5NANCE" <tanyeefong20040921@gmail.com>', // Add a display name
      to: email,
      subject: '5NANCE Password Reset Verification Code',
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #010725;">Password Reset Request</h2>
                  <p>You have requested to reset your password for your 5NANCE account.</p>
                  <p>Your verification code is:</p>
                  <h1 style="color: #010725; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">${code}</h1>
                  <p>This code will expire in 10 minutes.</p>
                  <p>If you didn't request this password reset, please ignore this email.</p>
                  <p>Best regards,<br>5NANCE Team</p>
              </div>
          `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info); // Debug log

    res.json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Detailed error sending verification code:", error);
    res.status(500).json({
      message: "Error sending verification code",
      error: error.message
    });
  }
});

//Forgot Password feature
// Update the send verification code endpoint
app.post("/api/users/send-verification-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log('Attempting to send code to:', email); // Debug log

    // Email content
    const mailOptions = {
      from: 'tanyeefong20040921@gmail.com', // Your Gmail address
      to: email,
      subject: '5NANCE Password Reset Verification Code',
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #010725;">Password Reset Request</h2>
                  <p>You have requested to reset your password for your 5NANCE account.</p>
                  <p>Your verification code is:</p>
                  <h1 style="color: #010725; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">${code}</h1>
                  <p>This code will expire in 10 minutes.</p>
                  <p>If you didn't request this password reset, please ignore this email.</p>
                  <p>Best regards,<br>5NANCE Team</p>
              </div>
          `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info); // Debug log

    res.json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Detailed error sending verification code:", error);
    res.status(500).json({
      message: "Error sending verification code",
      error: error.message
    });
  }
});

// Find user by email
app.post("/api/users/find-by-email", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userId: user._id });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ message: "Error finding user" });
  }
});