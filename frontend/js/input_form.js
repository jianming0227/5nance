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

  console.log("🚀 Form initialized")
  setupEventListeners()
  updateProgress()
  showStep(currentStep)
  updateNavigationButtons()
})

// Setup event listeners
function setupEventListeners() {

  console.log("🔧 Setting up event listeners")

  // Navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      console.log("▶️ Next button clicked")
      e.preventDefault()
      nextStep()
    })
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      console.log("◀️ Previous button clicked")
      e.preventDefault()
      prevStep()
    })
  }

  // Form submission
  if (form) {
    form.addEventListener("submit", handleSubmit)
  }


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


  console.log("✅ Event listeners set up complete")

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


  console.log("🎯 Selected goals:", selectedGoals)
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

  console.log("📊 Selected risk tolerance:", selectedRiskTolerance)

}

// Financial discipline selection
function selectFinancialDiscipline(card) {
  document.querySelectorAll(".behavior-card").forEach((c) => {
    c.classList.remove("selected")
  })
  card.classList.add("selected")
  selectedFinancialDiscipline = card.dataset.value

  console.log("💰 Selected financial discipline:", selectedFinancialDiscipline)

}

// Navigation functions
function nextStep() {

  console.log(`🔍 Validating step ${currentStep}`)

  if (validateCurrentStep()) {
    console.log(`✅ Step ${currentStep} validation passed`)
    if (currentStep < totalSteps) {
      currentStep++
      console.log(`➡️ Moving to step ${currentStep}`)
      showStep(currentStep)
      updateProgress()
      updateNavigationButtons()
    }

  } else {
    console.log(`❌ Step ${currentStep} validation failed`)

  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--
    console.log(`⬅️ Moving back to step ${currentStep}`)
    showStep(currentStep)
    updateProgress()
    updateNavigationButtons()
  }
}

function showStep(step) {
  console.log(`👁️ Showing step ${step}`)

  // Hide all steps
  document.querySelectorAll(".form-step").forEach((stepEl) => {
    stepEl.classList.remove("active")
  })

  // Show current step

  const currentStepEl = document.getElementById(`step${step}`)
  if (currentStepEl) {
    currentStepEl.classList.add("active")
  } else {
    console.error(`❌ Step element not found: step${step}`)
  }
}

function updateProgress() {
  const progress = (currentStep / totalSteps) * 100
  if (progressBar) {
    progressBar.style.width = `${progress}%`
    progressBar.setAttribute("aria-valuenow", progress)
  }
  if (progressText) {
    progressText.textContent = `Step ${currentStep} of ${totalSteps}`
  }
}

function updateNavigationButtons() {
  console.log(`🔄 Updating navigation buttons for step ${currentStep}`)

  // Previous button
  if (prevBtn) {
    if (currentStep === 1) {
      prevBtn.style.display = "none"
    } else {
      prevBtn.style.display = "inline-block"
    }
  }

  // Next/Submit button
  if (currentStep === totalSteps) {

    if (nextBtn) nextBtn.style.display = "none"
    if (submitBtn) submitBtn.style.display = "inline-block"
  } else {
    if (nextBtn) nextBtn.style.display = "inline-block"
    if (submitBtn) submitBtn.style.display = "none"
  }
}

// Validation functions
function validateCurrentStep() {
  console.log(`🔍 Validating step ${currentStep}`)

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
  console.log("🔍 Validating Step 1...")

  // Check employment status
  const employmentStatus = document.querySelector('input[name="employment_status"]:checked')
  console.log("Employment status element:", employmentStatus)
  console.log("Employment status value:", employmentStatus ? employmentStatus.value : "none")

  // Check monthly income
  const monthlyIncomeSelect = document.querySelector('select[name="monthly_income"]')
  const monthlyIncome = monthlyIncomeSelect ? monthlyIncomeSelect.value : ""
  console.log("Monthly income element:", monthlyIncomeSelect)
  console.log("Monthly income value:", monthlyIncome)

  // Check monthly expenses
  const monthlyExpensesSelect = document.querySelector('select[name="monthly_expenses"]')
  const monthlyExpenses = monthlyExpensesSelect ? monthlyExpensesSelect.value : ""
  console.log("Monthly expenses element:", monthlyExpensesSelect)
  console.log("Monthly expenses value:", monthlyExpenses)

  if (!employmentStatus) {
    console.log("❌ Employment status not selected")
    showAlert("Please select your employment status", "error")
    return false
  }

  if (!monthlyIncome) {

    console.log("❌ Monthly income not selected")

    showAlert("Please select your monthly income range", "error")
    return false
  }

  if (!monthlyExpenses) {
    console.log("❌ Monthly expenses not selected")
    showAlert("Please select your monthly expenses range", "error")
    return false
  }

  console.log("✅ Step 1 validation passed")
  return true
}

function validateStep2() {

  console.log("🔍 Validating Step 2...")

  const targetAmountInput = document.querySelector('input[name="target_amount"]')
  const targetAmount = targetAmountInput ? targetAmountInput.value : ""

  const targetDurationInput = document.querySelector('input[name="target_duration"]')
  const targetDuration = targetDurationInput ? targetDurationInput.value : ""

  console.log("Selected goals:", selectedGoals)
  console.log("Target amount:", targetAmount)
  console.log("Target duration:", targetDuration)

  if (selectedGoals.length === 0) {
    console.log("❌ No goals selected")
    showAlert("Please select at least one financial goal", "error")
    return false
  }

  if (!targetAmount || targetAmount <= 0) {
    console.log("❌ Invalid target amount")
    showAlert("Please enter a valid target amount", "error")
    return false
  }

  if (!targetDuration || targetDuration <= 0) {
    console.log("❌ Invalid target duration")
    showAlert("Please enter a valid target duration", "error")
    return false
  }

  console.log("✅ Step 2 validation passed")
  return true
}

function validateStep3() {
  console.log("🔍 Validating Step 3...")

  const investmentExperience = document.querySelector('input[name="investment_experience"]:checked')

  console.log("Risk tolerance:", selectedRiskTolerance)
  console.log("Investment experience:", investmentExperience ? investmentExperience.value : "none")

  if (!selectedRiskTolerance) {
    console.log("❌ Risk tolerance not selected")

    showAlert("Please select your risk tolerance", "error")
    return false
  }

  if (!investmentExperience) {
    console.log("❌ Investment experience not selected")
    showAlert("Please select your investment experience level", "error")
    return false
  }

  console.log("✅ Step 3 validation passed")
  return true
}

function validateStep4() {
  console.log("🔍 Validating Step 4...")

  const savingsInvestmentSelect = document.querySelector('select[name="savings_investment"]')
  const savingsInvestment = savingsInvestmentSelect ? savingsInvestmentSelect.value : ""

  const existingLoansSelect = document.querySelector('select[name="existing_loans"]')
  const existingLoans = existingLoansSelect ? existingLoansSelect.value : ""

  console.log("Savings investment:", savingsInvestment)
  console.log("Existing loans:", existingLoans)

  if (!savingsInvestment) {
    console.log("❌ Savings investment not selected")

    showAlert("Please select your current savings and investments range", "error")
    return false
  }

  if (!existingLoans) {
    console.log("❌ Existing loans not selected")
    showAlert("Please select your existing debt/loans range", "error")
    return false
  }


  console.log("✅ Step 4 validation passed")

  return true
}

function validateStep5() {

  console.log("🔍 Validating Step 5...")
  console.log("Financial discipline:", selectedFinancialDiscipline)

  if (!selectedFinancialDiscipline) {
    console.log("❌ Financial discipline not selected")
    showAlert("Please select your financial discipline level", "error")
    return false
  }

  console.log("✅ Step 5 validation passed")
  return true
}

// Form submission
async function handleSubmit(e) {
  e.preventDefault()
  console.log("📝 Form submission started")

  if (!validateCurrentStep()) {
    console.log("❌ Final validation failed")
    return
  }

  // Show loading state
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Submitting...'
    submitBtn.disabled = true
  }

  try {
    const formData = collectFormData()
    console.log("📤 Submitting form data:", formData)

    await submitToDatabase(formData)
    showSuccessMessage()
  } catch (error) {
    console.error("❌ Error submitting form:", error)
    showAlert("Failed to submit form. Please try again. Error: " + error.message, "error")

    // Reset submit button
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Complete Assessment'
      submitBtn.disabled = false
    }
  }
}

function collectFormData() {
  const formData = new FormData(form)
  const userId = localStorage.getItem("userId");

  const data = {
    userId,
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

  console.log("📋 Collected form data:", data)
  return data
}

async function submitToDatabase(data) {
  console.log("🌐 Sending to:", `${API_BASE_URL}/input_form`)

  const response = await fetch(`${API_BASE_URL}/input_form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  console.log("📡 Response status:", response.status)

  if (!response.ok) {
    const errorData = await response.json()
    console.error("❌ Server error:", errorData)
    throw new Error(`Server error: ${errorData.message || response.statusText}`)
  }

  const result = await response.json()
  console.log("✅ Success response:", result)
  return result
}

function showSuccessMessage() {
  const formContainer = document.querySelector(".form-container")
  const progressContainer = document.querySelector(".progress-container")
  localStorage.removeItem("userId");
  if (formContainer) formContainer.classList.add("d-none")
  if (progressContainer) progressContainer.classList.add("d-none")
  if (successMessage) successMessage.classList.remove("d-none")

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Utility functions
function showAlert(message, type = "info") {
  console.log(`🚨 Alert: ${type} - ${message}`)
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

// Debug function to check form state
function debugFormState() {
  console.log("🐛 DEBUG: Current form state")
  console.log("Current step:", currentStep)
  console.log("Selected goals:", selectedGoals)
  console.log("Risk tolerance:", selectedRiskTolerance)
  console.log("Financial discipline:", selectedFinancialDiscipline)

  // Check step 1 fields
  const employmentStatus = document.querySelector('input[name="employment_status"]:checked')
  const monthlyIncome = document.querySelector('select[name="monthly_income"]')
  const monthlyExpenses = document.querySelector('select[name="monthly_expenses"]')

  console.log("Employment status:", employmentStatus ? employmentStatus.value : "none")
  console.log("Monthly income:", monthlyIncome ? monthlyIncome.value : "none")
  console.log("Monthly expenses:", monthlyExpenses ? monthlyExpenses.value : "none")
}

// Make debug function available globally
window.debugFormState = debugFormState

