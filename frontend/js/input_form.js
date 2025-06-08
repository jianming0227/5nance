// API Configuration
const API_BASE_URL = "http://localhost:5000/api"

// Form state
let currentStep = 1
const totalSteps = 5
let selectedGoals = []
let selectedRiskTolerance = ""
let selectedFinancialDiscipline = ""

// DOM elements
const form = document.getElementById("financialProfileForm")
const prevBtn = document.getElementById("prevBtn")
const nextBtn = document.getElementById("nextBtn")
const submitBtn = document.getElementById("submitBtn")
const progressBar = document.getElementById("progressBar")
const progressText = document.getElementById("progressText")
const successMessage = document.getElementById("successMessage")

// Initialize form
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners()
  updateProgress()
  showStep(currentStep)
})

// Setup event listeners
function setupEventListeners() {
  // Navigation buttons
  nextBtn.addEventListener("click", nextStep)
  prevBtn.addEventListener("click", prevStep)

  // Form submission
  form.addEventListener("submit", handleSubmit)

  // Goal selection
  document.querySelectorAll(".goal-card").forEach((card) => {
    card.addEventListener("click", function () {
      toggleGoalSelection(this)
    })
  })

  // Risk tolerance selection
  document.querySelectorAll(".risk-option").forEach((option) => {
    option.addEventListener("click", function () {
      selectRiskTolerance(this)
    })
  })

  // Financial discipline selection
  document.querySelectorAll(".behavior-card").forEach((card) => {
    card.addEventListener("click", function () {
      selectFinancialDiscipline(this)
    })
  })
}

// Goal selection logic
function toggleGoalSelection(card) {
  const value = card.dataset.value

  if (card.classList.contains("selected")) {
    // Deselect
    card.classList.remove("selected")
    selectedGoals = selectedGoals.filter((goal) => goal !== value)
  } else {
    // Select (max 3)
    if (selectedGoals.length < 3) {
      card.classList.add("selected")
      selectedGoals.push(value)
    } else {
      showAlert("You can select maximum 3 goals", "warning")
    }
  }

  updateGoalSelectionDisplay()
}

function updateGoalSelectionDisplay() {
  const goalCards = document.querySelectorAll(".goal-card")
  goalCards.forEach((card) => {
    if (!card.classList.contains("selected") && selectedGoals.length >= 3) {
      card.style.opacity = "0.5"
      card.style.pointerEvents = "none"
    } else {
      card.style.opacity = "1"
      card.style.pointerEvents = "auto"
    }
  })
}

// Risk tolerance selection
function selectRiskTolerance(option) {
  document.querySelectorAll(".risk-option").forEach((opt) => {
    opt.classList.remove("selected")
  })
  option.classList.add("selected")
  selectedRiskTolerance = option.dataset.value
}

// Financial discipline selection
function selectFinancialDiscipline(card) {
  document.querySelectorAll(".behavior-card").forEach((c) => {
    c.classList.remove("selected")
  })
  card.classList.add("selected")
  selectedFinancialDiscipline = card.dataset.value
}

// Navigation functions
function nextStep() {
  if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
      currentStep++
      showStep(currentStep)
      updateProgress()
      updateNavigationButtons()
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--
    showStep(currentStep)
    updateProgress()
    updateNavigationButtons()
  }
}

function showStep(step) {
  // Hide all steps
  document.querySelectorAll(".form-step").forEach((stepEl) => {
    stepEl.classList.remove("active")
  })

  // Show current step
  document.getElementById(`step${step}`).classList.add("active")
}

function updateProgress() {
  const progress = (currentStep / totalSteps) * 100
  progressBar.style.width = `${progress}%`
  progressBar.setAttribute("aria-valuenow", progress)
  progressText.textContent = `Step ${currentStep} of ${totalSteps}`
}

function updateNavigationButtons() {
  // Previous button
  if (currentStep === 1) {
    prevBtn.style.display = "none"
  } else {
    prevBtn.style.display = "inline-block"
  }

  // Next/Submit button
  if (currentStep === totalSteps) {
    nextBtn.style.display = "none"
    submitBtn.style.display = "inline-block"
  } else {
    nextBtn.style.display = "inline-block"
    submitBtn.style.display = "none"
  }
}

// Validation functions
function validateCurrentStep() {
  switch (currentStep) {
    case 1:
      return validateStep1()
    case 2:
      return validateStep2()
    case 3:
      return validateStep3()
    case 4:
      return validateStep4()
    case 5:
      return validateStep5()
    default:
      return true
  }
}

function validateStep1() {
  const employmentStatus = document.querySelector('input[name="employment_status"]:checked')
  const monthlyIncome = document.querySelector('select[name="monthly_income"]').value
  const monthlyExpenses = document.querySelector('select[name="monthly_expenses"]').value

  if (!employmentStatus) {
    showAlert("Please select your employment status", "error")
    return false
  }

  if (!monthlyIncome) {
    showAlert("Please select your monthly income range", "error")
    return false
  }

  if (!monthlyExpenses) {
    showAlert("Please select your monthly expenses range", "error")
    return false
  }

  return true
}

function validateStep2() {
  const targetAmount = document.querySelector('input[name="target_amount"]').value
  const targetDuration = document.querySelector('input[name="target_duration"]').value

  if (selectedGoals.length === 0) {
    showAlert("Please select at least one financial goal", "error")
    return false
  }

  if (!targetAmount || targetAmount <= 0) {
    showAlert("Please enter a valid target amount", "error")
    return false
  }

  if (!targetDuration || targetDuration <= 0) {
    showAlert("Please enter a valid target duration", "error")
    return false
  }

  return true
}

function validateStep3() {
  const investmentExperience = document.querySelector('input[name="investment_experience"]:checked')

  if (!selectedRiskTolerance) {
    showAlert("Please select your risk tolerance", "error")
    return false
  }

  if (!investmentExperience) {
    showAlert("Please select your investment experience level", "error")
    return false
  }

  return true
}

function validateStep4() {
  const savingsInvestment = document.querySelector('select[name="savings_investment"]').value
  const existingLoans = document.querySelector('select[name="existing_loans"]').value

  if (!savingsInvestment) {
    showAlert("Please select your current savings and investments range", "error")
    return false
  }

  if (!existingLoans) {
    showAlert("Please select your existing debt/loans range", "error")
    return false
  }

  return true
}

function validateStep5() {
  if (!selectedFinancialDiscipline) {
    showAlert("Please select your financial discipline level", "error")
    return false
  }

  return true
}

// Form submission
async function handleSubmit(e) {
  e.preventDefault()

  if (!validateCurrentStep()) {
    return
  }

  // Show loading state
  submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Submitting...'
  submitBtn.disabled = true

  try {
    const formData = collectFormData()
    await submitToDatabase(formData)
    showSuccessMessage()
  } catch (error) {
    console.error("Error submitting form:", error)
    showAlert("Failed to submit form. Please try again.", "error")

    // Reset submit button
    submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Complete Assessment'
    submitBtn.disabled = false
  }
}

function collectFormData() {
  const formData = new FormData(form)

  return {
    employment_status: formData.get("employment_status"),
    monthly_income: formData.get("monthly_income"),
    monthly_expenses: formData.get("monthly_expenses"),
    goal_types: selectedGoals,
    target_amount: Number.parseInt(formData.get("target_amount")),
    target_duration: Number.parseInt(formData.get("target_duration")),
    risk_tolerance: selectedRiskTolerance,
    investment_experience: formData.get("investment_experience"),
    savings_investment: formData.get("savings_investment"),
    existing_loans: formData.get("existing_loans"),
    financial_discipline: selectedFinancialDiscipline,
    submitted_at: new Date().toISOString(),
  }
}

async function submitToDatabase(data) {
  const response = await fetch(`${API_BASE_URL}/input-form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

function showSuccessMessage() {
  document.querySelector(".form-container").classList.add("d-none")
  document.querySelector(".progress-container").classList.add("d-none")
  successMessage.classList.remove("d-none")

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Utility functions
function showAlert(message, type = "info") {
  // Create alert element
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type === "error" ? "danger" : type === "warning" ? "warning" : "info"} alert-dismissible fade show position-fixed`
  alertDiv.style.cssText = "top: 100px; right: 20px; z-index: 1050; min-width: 300px;"

  const icon = type === "error" ? "exclamation-triangle" : type === "warning" ? "exclamation-circle" : "info-circle"

  alertDiv.innerHTML = `
    <i class="bi bi-${icon} me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `

  document.body.appendChild(alertDiv)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove()
    }
  }, 5000)
}

// Initialize on page load
updateNavigationButtons()
