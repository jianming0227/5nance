// Initial goals data
let goals = [
  {
    id: "1",
    name: "Retirement",
    targetAmount: 500000,
    currentAmount: 150000,
    targetDate: "2050-01-01",
    priority: 1,
    description: "Save for comfortable retirement",
    category: "retirement"
  },
  {
    id: "2",
    name: "Down Payment for House",
    targetAmount: 100000,
    currentAmount: 35000,
    targetDate: "2026-06-30",
    priority: 2,
    description: "Save for 20% down payment on a house",
    category: "housing"
  },
  {
    id: "3",
    name: "College Fund",
    targetAmount: 120000,
    currentAmount: 15000,
    targetDate: "2035-08-01",
    priority: 3,
    description: "Save for children's education",
    category: "education"
  }
];

// DOM elements
const addGoalButton = document.getElementById('add-goal-button');
const addGoalForm = document.getElementById('add-goal-form');
const addGoalButtonContainer = document.getElementById('add-goal-button-container');
const cancelAddGoalButton = document.getElementById('cancel-add-goal');
const goalForm = document.getElementById('goal-form');
const goalsContainer = document.getElementById('goals-container');
const editGoalForm = document.getElementById('edit-goal-form');
const saveEditGoalButton = document.getElementById('save-edit-goal');
const saveSavingsButton = document.getElementById('save-savings');

// Bootstrap modals
const editGoalModalElement = document.getElementById('editGoalModal');
const addSavingsModalElement = document.getElementById('addSavingsModal');

const bootstrap = window.bootstrap; // Declaring bootstrap variable

const editGoalModal = new bootstrap.Modal(editGoalModalElement);
const addSavingsModal = new bootstrap.Modal(addSavingsModalElement);

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  renderGoals();
  setupSortable();
  
  // Add goal button
  addGoalButton.addEventListener('click', () => {
    addGoalButtonContainer.classList.add('d-none');
    addGoalForm.classList.remove('d-none');
  });
  
  // Cancel add goal
  cancelAddGoalButton.addEventListener('click', () => {
    addGoalButtonContainer.classList.remove('d-none');
    addGoalForm.classList.add('d-none');
    goalForm.reset();
  });
  
  // Submit new goal
  goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewGoal();
  });
  
  // Save edited goal
  saveEditGoalButton.addEventListener('click', saveEditedGoal);
  
  // Save savings
  saveSavingsButton.addEventListener('click', saveSavingsAmount);
});

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Calculate progress percentage
function calculateProgress(current, target) {
  return Math.min(Math.round((current / target) * 100), 100);
}

// Render all goals
function renderGoals() {
  // Sort goals by priority
  const sortedGoals = [...goals].sort((a, b) => a.priority - b.priority);
  
  // Clear container
  goalsContainer.innerHTML = '';
  
  if (sortedGoals.length === 0) {
    goalsContainer.innerHTML = `
      <div class="text-center p-4 border border-dashed rounded">
        <p class="text-white">No financial goals yet. Add your first goal to get started!</p>
      </div>
    `;
    return;
  }
  
  // Add each goal card
  sortedGoals.forEach((goal, index) => {
    const progressPercentage = calculateProgress(goal.currentAmount, goal.targetAmount);
    const canMoveUp = index > 0;
    const canMoveDown = index < sortedGoals.length - 1;
    
    const goalCard = document.createElement('div');
    goalCard.className = 'goal-card';
    goalCard.dataset.id = goal.id;
    goalCard.style.animationDelay = `${index * 0.1}s`;
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
                <li><a class="dropdown-item edit-goal" href="#" data-id="${goal.id}"><i class="bi bi-pencil me-2"></i>Edit</a></li>
                <li><a class="dropdown-item text-danger delete-goal" href="#" data-id="${goal.id}"><i class="bi bi-trash me-2"></i>Delete</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <p class="goal-description">${goal.description || ''}</p>
          
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
          
          <!-- Move buttons - Positioned below the target amount -->
          <div class="move-buttons">
            <button class="btn btn-sm move-up" ${!canMoveUp ? 'disabled' : ''} data-id="${goal.id}" title="Move Up">
              <i class="bi bi-arrow-up"></i>
              <span class="visually-hidden">Move Up</span>
            </button>
            <button class="btn btn-sm move-down" ${!canMoveDown ? 'disabled' : ''} data-id="${goal.id}" title="Move Down">
              <i class="bi bi-arrow-down"></i>
              <span class="visually-hidden">Move Down</span>
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
          
          <button class="btn btn-outline-primary btn-sm w-100 add-savings" data-id="${goal.id}">
            <i class="bi bi-plus-lg me-1"></i> Add Savings
          </button>
        </div>
      </div>
    `;
    
    goalsContainer.appendChild(goalCard);
  });
  
  // Add event listeners to buttons
  addEventListenersToGoalCards();
}

// Add event listeners to goal cards
function addEventListenersToGoalCards() {
  // Edit goal buttons
  document.querySelectorAll('.edit-goal').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const goalId = e.target.dataset.id;
      openEditGoalModal(goalId);
    });
  });
  
  // Delete goal buttons
  document.querySelectorAll('.delete-goal').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const goalId = e.target.dataset.id;
      deleteGoal(goalId);
    });
  });
  
  // Add savings buttons
  document.querySelectorAll('.add-savings').forEach(button => {
    button.addEventListener('click', (e) => {
      const goalId = e.target.dataset.id;
      openAddSavingsModal(goalId);
    });
  });
  
  // Move up buttons
  document.querySelectorAll('.move-up').forEach(button => {
    button.addEventListener('click', (e) => {
      const goalId = e.target.dataset.id;
      moveGoalUp(goalId);
    });
  });
  
  // Move down buttons
  document.querySelectorAll('.move-down').forEach(button => {
    button.addEventListener('click', (e) => {
      const goalId = e.target.dataset.id;
      moveGoalDown(goalId);
    });
  });
}

// Setup sortable for drag and drop
function setupSortable() {
  const Sortable = window.Sortable;
  const sortable = new Sortable(goalsContainer, {
    animation: 150,
    handle: '.drag-handle',
    ghostClass: 'sortable-ghost',
    onEnd: function(evt) {
      updateGoalPriorities();
    },
  });
}

// Update goal priorities after drag and drop
function updateGoalPriorities() {
  const goalElements = document.querySelectorAll('.goal-card');
  const newGoals = [...goals];
  
  goalElements.forEach((element, index) => {
    const goalId = element.dataset.id;
    const goalIndex = newGoals.findIndex(g => g.id === goalId);
    
    if (goalIndex !== -1) {
      newGoals[goalIndex].priority = index + 1;
    }
  });
  
  goals = newGoals;
  renderGoals();
}

// Add new goal
function addNewGoal() {
  const name = document.getElementById('goal-name').value;
  const targetAmount = parseFloat(document.getElementById('target-amount').value);
  const currentAmount = parseFloat(document.getElementById('current-amount').value) || 0;
  const category = document.getElementById('category').value;
  const targetDate = document.getElementById('target-date').value;
  const description = document.getElementById('description').value;
  
  const newGoal = {
    id: Date.now().toString(),
    name,
    targetAmount,
    currentAmount,
    targetDate,
    priority: goals.length + 1,
    description,
    category
  };
  
  goals.push(newGoal);
  
  // Reset and hide form
  goalForm.reset();
  addGoalForm.classList.add('d-none');
  addGoalButtonContainer.classList.remove('d-none');
  
  renderGoals();
}

// Open edit goal modal
function openEditGoalModal(goalId) {
  const goal = goals.find(g => g.id === goalId);
  if (!goal) return;
  
  document.getElementById('edit-goal-id').value = goal.id;
  document.getElementById('edit-goal-name').value = goal.name;
  document.getElementById('edit-target-amount').value = goal.targetAmount;
  document.getElementById('edit-current-amount').value = goal.currentAmount;
  document.getElementById('edit-category').value = goal.category;
  document.getElementById('edit-target-date').value = goal.targetDate;
  document.getElementById('edit-description').value = goal.description || '';
  
  editGoalModal.show();
}

// Save edited goal
function saveEditedGoal() {
  const goalId = document.getElementById('edit-goal-id').value;
  const name = document.getElementById('edit-goal-name').value;
  const targetAmount = parseFloat(document.getElementById('edit-target-amount').value);
  const currentAmount = parseFloat(document.getElementById('edit-current-amount').value);
  const category = document.getElementById('edit-category').value;
  const targetDate = document.getElementById('edit-target-date').value;
  const description = document.getElementById('edit-description').value;
  
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex !== -1) {
    goals[goalIndex] = {
      ...goals[goalIndex],
      name,
      targetAmount,
      currentAmount,
      targetDate,
      description,
      category
    };
    
    renderGoals();
    editGoalModal.hide();
  }
}

// Delete goal
function deleteGoal(goalId) {
  if (confirm('Are you sure you want to delete this goal?')) {
    goals = goals.filter(g => g.id !== goalId);
    
    // Update priorities
    goals = goals.map((goal, index) => ({
      ...goal,
      priority: index + 1
    }));
    
    renderGoals();
  }
}

// Open add savings modal
function openAddSavingsModal(goalId) {
  document.getElementById('savings-goal-id').value = goalId;
  document.getElementById('savings-amount').value = '';
  addSavingsModal.show();
}

// Save savings amount
function saveSavingsAmount() {
  const goalId = document.getElementById('savings-goal-id').value;
  const amount = parseFloat(document.getElementById('savings-amount').value);
  
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex !== -1) {
    goals[goalIndex].currentAmount += amount;
    renderGoals();
    addSavingsModal.hide();
  }
}

// Move goal up
function moveGoalUp(goalId) {
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex > 0) {
    // Swap with the goal above
    const temp = goals[goalIndex];
    goals[goalIndex] = goals[goalIndex - 1];
    goals[goalIndex - 1] = temp;
    
    // Update priorities
    updateGoalPriorities();
  }
}

// Move goal down
function moveGoalDown(goalId) {
  const goalIndex = goals.findIndex(g => g.id === goalId);
  if (goalIndex < goals.length - 1) {
    // Swap with the goal below
    const temp = goals[goalIndex];
    goals[goalIndex] = goals[goalIndex + 1];
    goals[goalIndex + 1] = temp;
    
    // Update priorities
    updateGoalPriorities();
  }
}