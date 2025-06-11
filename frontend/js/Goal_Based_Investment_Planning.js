// API Configuration
const API_BASE_URL = "http://localhost:5000/api"
let USER_ID = localStorage.getItem("userId") // Changed from USERNAME to USER_ID

// Global variables
let goals = []

// DOM elements
const addGoalButton = document.getElementById("add-goal-button")
const addGoalForm = document.getElementById("add-goal-form")
const addGoalButtonContainer = document.getElementById("add-goal-button-container")
const cancelAddGoalButton = document.getElementById("cancel-add-goal")
const goalForm = document.getElementById("goal-form")
const goalsContainer = document.getElementById("goals-container")
const editGoalForm = document.getElementById("edit-goal-form")
const saveEditGoalButton = document.getElementById("save-edit-goal")
const saveSavingsButton = document.getElementById("save-savings")

// Bootstrap modals
const editGoalModalElement = document.getElementById("editGoalModal")
const addSavingsModalElement = document.getElementById("addSavingsModal")

const bootstrap = window.bootstrap
const editGoalModal = new bootstrap.Modal(editGoalModalElement)
const addSavingsModal = new bootstrap.Modal(addSavingsModalElement)

//Goal_Based_Investment_Planning feature
// API Functions
class GoalAPI {
  static async getAllGoals() {
    try {
      const response = await fetch(`${API_BASE_URL}/goals?userId=${USER_ID}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching goals:", error)
      throw error
    }
  }

  static async createGoal(goalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...goalData, userId: USER_ID }),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error creating goal:", error)
      throw error
    }
  }

  static async updateGoal(goalId, goalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalData),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error updating goal:", error)
      throw error
    }
  }

  static async deleteGoal(goalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error deleting goal:", error)
      throw error
    }
  }

  static async addSavings(goalId, amount) {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}/add-savings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error adding savings:", error)
      throw error
    }
  }

  //Goal_Based_Investment_Planning feature
  // Update the reorderGoals method in GoalAPI class
  static async reorderGoals(goalIds) {
    try {
      if (!Array.isArray(goalIds) || goalIds.length === 0) {
        throw new Error('Invalid goalIds array');
      }

      // Log the goalIds being sent
      console.log('Sending goalIds to server:', goalIds);

      const response = await fetch(`${API_BASE_URL}/goals/reorder?userId=${USER_ID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received updated goals:', data); // Log the response
      return data;
    } catch (error) {
      console.error("Error reordering goals:", error);
      throw error;
    }
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", async () => {
  await loadGoals()
  setupSortable()

  // Add goal button
  addGoalButton.addEventListener("click", () => {
    addGoalButtonContainer.classList.add("d-none")
    addGoalForm.classList.remove("d-none")
  })

  // Cancel add goal
  cancelAddGoalButton.addEventListener("click", () => {
    addGoalButtonContainer.classList.remove("d-none")
    addGoalForm.classList.add("d-none")
    goalForm.reset()
  })

  // Submit new goal
  goalForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    await addNewGoal()
  })

  // Save edited goal
  saveEditGoalButton.addEventListener("click", saveEditedGoal)

  // Save savings
  saveSavingsButton.addEventListener("click", saveSavingsAmount)
})

// Load goals from database
async function loadGoals() {
  try {
    showLoading()
    goals = await GoalAPI.getAllGoals()
    renderGoals()
  } catch (error) {
    showError("Failed to load goals. Please make sure your backend server is running on http://localhost:5000")
  }
}

// Show loading state
function showLoading() {
  goalsContainer.innerHTML = `
    <div class="text-center p-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-white">Loading your goals...</p>
    </div>
  `
}

// Show error message
function showError(message) {
  goalsContainer.innerHTML = `
    <div class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      ${message}
    </div>
  `
}

// Show success message
function showSuccess(message) {
  const alertDiv = document.createElement("div")
  alertDiv.className = "alert alert-success alert-dismissible fade show position-fixed"
  alertDiv.style.cssText = "top: 100px; right: 20px; z-index: 1050; min-width: 300px;"
  alertDiv.innerHTML = `
    <i class="bi bi-check-circle me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `

  document.body.appendChild(alertDiv)

  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove()
    }
  }, 3000)
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

// Calculate progress percentage
function calculateProgress(current, target) {
  return Math.min(Math.round((current / target) * 100), 100)
}

// Render all goals
function renderGoals() {
  // Clear container
  goalsContainer.innerHTML = ""

  if (goals.length === 0) {
    goalsContainer.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-target display-1 text-muted mb-3"></i>
        <h3 class="text-white mb-3">Welcome to Your Financial Journey!</h3>
        <p class="text-muted mb-4">You haven't set any financial goals yet. Start by creating your first goal to begin planning for your future.</p>
        <div class="d-flex justify-content-center">
          <button class="btn btn-primary btn-lg" onclick="document.getElementById('add-goal-button').click()">
            <i class="bi bi-plus-lg me-2"></i>Create Your First Goal
          </button>
        </div>
      </div>
    `
    return
  }

  // Add each goal card
  goals.forEach((goal, index) => {
    const progressPercentage = calculateProgress(goal.currentAmount, goal.targetAmount)
    const canMoveUp = index > 0
    const canMoveDown = index < goals.length - 1

    const goalCard = document.createElement("div")
    goalCard.className = "goal-card"
    goalCard.dataset.id = goal._id
    goalCard.style.animationDelay = `${index * 0.1}s`
    goalCard.innerHTML = `
      <div class="card">
        <div class="drag-handle">
          <i class="bi bi-grip-vertical"></i>
        </div>
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="card-title mb-1">${goal.name}</h5>
              <span class="badge badge-${goal.category}">${goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}</span>
            </div>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item edit-goal" href="#" data-id="${goal._id}"><i class="bi bi-pencil me-2"></i>Edit</a></li>
                <li><a class="dropdown-item text-danger delete-goal" href="#" data-id="${goal._id}"><i class="bi bi-trash me-2"></i>Delete</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <p class="goal-description">${goal.description || ""}</p>
          
          <div class="row mb-3">
            <div class="col-6">
              <div class="info-row">
                <i class="bi bi-currency-dollar info-icon"></i>
                <div>
                  <div class="info-label">Target</div>
                  <div class="info-value">${formatCurrency(goal.targetAmount)}</div>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="info-row">
                <i class="bi bi-calendar info-icon"></i>
                <div>
                  <div class="info-label">Target Date</div>
                  <div class="info-value">${formatDate(goal.targetDate)}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="move-buttons">
            <button class="btn btn-sm move-up" ${!canMoveUp ? "disabled" : ""} data-id="${goal._id}" title="Move Up">
              <i class="bi bi-arrow-up"></i>
            </button>
            <button class="btn btn-sm move-down" ${!canMoveDown ? "disabled" : ""} data-id="${goal._id}" title="Move Down">
              <i class="bi bi-arrow-down"></i>
            </button>
          </div>
          
          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="small fw-medium">Progress</span>
              <span class="small fw-medium progress-percentage">${progressPercentage}%</span>
            </div>
            <div class="progress">
              <div class="progress-bar" role="progressbar" style="width: ${progressPercentage}%" 
                aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="d-flex justify-content-between small mt-1">
              <span class="text-white">${formatCurrency(goal.currentAmount)}</span>
              <span class="text-white">${formatCurrency(goal.targetAmount)}</span>
            </div>
          </div>
          
          <button class="btn btn-outline-primary btn-sm w-100 add-savings" data-id="${goal._id}">
            <i class="bi bi-plus-lg me-1"></i> Add Savings
          </button>
        </div>
      </div>
    `

    goalsContainer.appendChild(goalCard)
  })

  // Add event listeners to buttons
  addEventListenersToGoalCards()
}

// Add event listeners to goal cards
function addEventListenersToGoalCards() {
  // Edit goal buttons
  document.querySelectorAll(".edit-goal").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const goalId = e.target.dataset.id
      openEditGoalModal(goalId)
    })
  })

  // Delete goal buttons
  document.querySelectorAll(".delete-goal").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault()
      const goalId = e.target.dataset.id
      await deleteGoal(goalId)
    })
  })

  // Add savings buttons
  document.querySelectorAll(".add-savings").forEach((button) => {
    button.addEventListener("click", (e) => {
      const goalId = e.target.dataset.id
      openAddSavingsModal(goalId)
    })
  })

  //Goal_Based_Investment_Planning feature
  // Move up buttons
  document.querySelectorAll(".move-up").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const goalId = e.currentTarget.dataset.id;
      if (!goalId) {
        console.error('No goal ID found');
        return;
      }
      await moveGoalUp(goalId);
    });
  });

  // Move down buttons
  document.querySelectorAll(".move-down").forEach((button) => {
    button.addEventListener("click", async (e) => {
      e.preventDefault();
      const goalId = e.currentTarget.dataset.id;
      if (!goalId) {
        console.error('No goal ID found');
        return;
      }
      await moveGoalDown(goalId);
    });
  });
}

// Setup sortable for drag and drop
function setupSortable() {
  const Sortable = window.Sortable
  if (Sortable) {
    const sortable = new Sortable(goalsContainer, {
      animation: 150,
      handle: ".drag-handle",
      ghostClass: "sortable-ghost",
      onEnd: async (evt) => {
        await updateGoalPriorities()
      },
    })
  }
}

// Update goal priorities after drag and drop
async function updateGoalPriorities() {
  try {
    const goalElements = document.querySelectorAll(".goal-card")
    const goalIds = Array.from(goalElements).map((element) => element.dataset.id)

    goals = await GoalAPI.reorderGoals(goalIds)
    renderGoals()
  } catch (error) {
    console.error("Error reordering goals:", error)
    showError("Failed to reorder goals")
    await loadGoals() // Reload on error
  }
}

// Add new goal
async function addNewGoal() {
  try {
    const goalData = {
      name: document.getElementById("goal-name").value,
      targetAmount: Number.parseFloat(document.getElementById("target-amount").value),
      currentAmount: Number.parseFloat(document.getElementById("current-amount").value) || 0,
      category: document.getElementById("category").value,
      targetDate: document.getElementById("target-date").value,
      description: document.getElementById("description").value,
    }

    const newGoal = await GoalAPI.createGoal(goalData)
    goals.push(newGoal)

    // Reset and hide form
    goalForm.reset()
    addGoalForm.classList.add("d-none")
    addGoalButtonContainer.classList.remove("d-none")

    renderGoals()
    showSuccess("Goal added successfully!")
  } catch (error) {
    showError("Failed to add goal. Please try again.")
  }
}

// Open edit goal modal
function openEditGoalModal(goalId) {
  const goal = goals.find((g) => g._id === goalId)
  if (!goal) return

  document.getElementById("edit-goal-id").value = goal._id
  document.getElementById("edit-goal-name").value = goal.name
  document.getElementById("edit-target-amount").value = goal.targetAmount
  document.getElementById("edit-current-amount").value = goal.currentAmount
  document.getElementById("edit-category").value = goal.category
  document.getElementById("edit-target-date").value = goal.targetDate
  document.getElementById("edit-description").value = goal.description || ""

  editGoalModal.show()
}

// Save edited goal
async function saveEditedGoal() {
  try {
    const goalId = document.getElementById("edit-goal-id").value
    const goalData = {
      name: document.getElementById("edit-goal-name").value,
      targetAmount: Number.parseFloat(document.getElementById("edit-target-amount").value),
      currentAmount: Number.parseFloat(document.getElementById("edit-current-amount").value),
      category: document.getElementById("edit-category").value,
      targetDate: document.getElementById("edit-target-date").value,
      description: document.getElementById("edit-description").value,
    }

    const updatedGoal = await GoalAPI.updateGoal(goalId, goalData)
    const goalIndex = goals.findIndex((g) => g._id === goalId)
    if (goalIndex !== -1) {
      goals[goalIndex] = updatedGoal
    }

    renderGoals()
    editGoalModal.hide()
    showSuccess("Goal updated successfully!")
  } catch (error) {
    showError("Failed to update goal. Please try again.")
  }
}

// Delete goal
async function deleteGoal(goalId) {
  if (!confirm("Are you sure you want to delete this goal?")) {
    return
  }

  try {
    await GoalAPI.deleteGoal(goalId)
    goals = goals.filter((g) => g._id !== goalId)
    renderGoals()
    showSuccess("Goal deleted successfully!")
  } catch (error) {
    showError("Failed to delete goal. Please try again.")
  }
}

// Open add savings modal
function openAddSavingsModal(goalId) {
  document.getElementById("savings-goal-id").value = goalId
  document.getElementById("savings-amount").value = ""
  addSavingsModal.show()
}

// Save savings amount
async function saveSavingsAmount() {
  try {
    const goalId = document.getElementById("savings-goal-id").value
    const amount = Number.parseFloat(document.getElementById("savings-amount").value)

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    const updatedGoal = await GoalAPI.addSavings(goalId, amount)
    const goalIndex = goals.findIndex((g) => g._id === goalId)
    if (goalIndex !== -1) {
      goals[goalIndex] = updatedGoal
    }

    renderGoals()
    addSavingsModal.hide()
    showSuccess(`Added ${formatCurrency(amount)} to your goal!`)
  } catch (error) {
    showError("Failed to add savings. Please try again.")
  }
}

//Goal_Based_Investment_Planning feature
// Move goal up
async function moveGoalUp(goalId) {
  if (!goalId) {
    console.error('Invalid goal ID');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}/move-up`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to move goal up');
    }

    const updatedGoals = await response.json();
    goals = updatedGoals;
    renderGoals();
  } catch (error) {
    console.error('Error in moveGoalUp:', error);
    showError("Failed to move goal up. Please try again.");
    await loadGoals();
  }
}

// Move goal down
async function moveGoalDown(goalId) {
  if (!goalId) {
    console.error('Invalid goal ID');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}/move-down`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to move goal down');
    }

    const updatedGoals = await response.json();
    goals = updatedGoals;
    renderGoals();
  } catch (error) {
    console.error('Error in moveGoalDown:', error);
    showError("Failed to move goal down. Please try again.");
    await loadGoals();
  }
}

//Goal_Based_Investment_Planning feature
// Function to set user ID (to be called from login page)
function setUserId(userId) {
  USER_ID = userId
  loadGoals() // Reload goals for the new user
}

// Export function for use in other modules
window.setUserId = setUserId
