// Custom JavaScript for 5NANCE

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const suggestBtn = document.getElementById('suggestBtn');
    const aiAnalysisOverlay = document.getElementById('aiAnalysisOverlay');
    const strategyDetailOverlay = document.getElementById('strategyDetailOverlay');
    const closeDetailBtn = document.getElementById('closeDetailBtn');
    const strategiesContainer = document.getElementById('strategiesContainer');
    const sortDropdown = document.getElementById('sortDropdown');
    const sortDropdownHeader = document.querySelector('.sort-dropdown-header');
    const sortDropdownMenu = document.querySelector('.sort-dropdown-menu');
    const sortOptions = document.querySelectorAll('.sort-option');
    const currentSortText = document.getElementById('currentSort');
    const customizeBtn = document.getElementById("customizeBtn");
    const customizeOverlay = document.getElementById("customizeOverlay");
    const closeCustomizeBtn = document.getElementById("closeCustomizeBtn");
    
  // Strategy data
  // Fetch strategies from MongoDB via backend API
  function fetchStrategies() {
    fetch('http://localhost:5000/api/strategies')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched strategies:", data); // Debug log

        // Convert array to object keyed by ID
        strategyData = data.reduce((acc, strategy) => {
          acc[strategy._id] = {
            title: strategy.strategy_name,
            riskLevel: strategy.risk_level,
            return: strategy.return_rate,
            duration: strategy.duration_years,
            description: strategy.strategy_description,
          };
          return acc;
        }, {});

        renderStrategies();
      })
      .catch(error => {
        console.error('Failed to fetch strategies:', error);
      });
  }

  // Render strategies dynamically into container
  function renderStrategies() {
    const container = document.getElementById('strategiesContainer');
    container.innerHTML = ''; // Clear old cards

    for (const [id, strategy] of Object.entries(strategyData)) {
      const cardHTML = `
        <div class="col-md-6 mb-4">
          <div class="strategy-card card shadow-sm" data-strategy="${id}">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <h2 class="strategy-title">${strategy.title}</h2>
            </div>

            <div class="row mb-4">
              <div class="col-6">
                <p class="risk-level">Risk level: ${strategy.riskLevel}</p>
                <p class="return-value">Return: ${strategy.return}</p>
              </div>
              <div class="col-6">
                <p class="duration">Duration: ${strategy.duration}</p>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-primary btn-sm view-detail-btn">
                View detail <span></span>
              </button>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', cardHTML);
    }

    // Hook up interactive features again
    initViewDetailButtons();
  }

  // Ensure fetching starts on page load
    console.log("AI.js script loaded");
    fetchStrategies();
    
    // Initialize sort dropdown
    function initSortDropdown() {
      // Toggle dropdown
      sortDropdownHeader.addEventListener('click', function() {
        sortDropdownMenu.classList.toggle('show');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(event) {
        if (!sortDropdown.contains(event.target)) {
          sortDropdownMenu.classList.remove('show');
        }
      });
      
      // Sort options
      sortOptions.forEach(option => {
        option.addEventListener('click', function() {
          const sortType = this.dataset.sort;
          
          // Update active class
          sortOptions.forEach(opt => opt.classList.remove('active'));
          this.classList.add('active');
          
          // Update header text
          currentSortText.textContent = `Sort by: ${this.textContent}`;
          
          // Close dropdown
          sortDropdownMenu.classList.remove('show');
          
          // Sort strategies
          sortStrategies(sortType);
          
          console.log(`Sorted by: ${sortType}`);
        });
      });
    }
    
    // Sort strategies based on criteria
    function sortStrategies(sortType) {
      const strategiesArray = Object.entries(strategyData).map(([id, data]) => ({
        id,
        ...data
      }));

      switch(sortType) {
        case 'highest-return':
          strategiesArray.sort((a, b) => parseFloat(b.return) - parseFloat(a.return));
          break;
        case 'lowest-risk':
          const riskOrder = { 'low': 1, 'moderate': 2, 'high': 3 };
          strategiesArray.sort((a, b) =>
            riskOrder[a.riskLevel.toLowerCase()] - riskOrder[b.riskLevel.toLowerCase()]
          );
          break;
        case 'shortest-duration':
          strategiesArray.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
          break;
        default:
          break;
      }

      const container = document.getElementById('strategiesContainer');
      strategiesArray.forEach(strategy => {
        const strategyElement = document.querySelector(`.strategy-card[data-strategy="${strategy.id}"]`).closest('.col-md-6');
        container.appendChild(strategyElement);
      });
    }
    
    // Initialize view detail buttons
    function initViewDetailButtons() {
      const viewDetailButtons = document.querySelectorAll('.view-detail-btn');
      
      viewDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
          const strategyCard = this.closest('.strategy-card');
          const strategyId = strategyCard.dataset.strategy;
          showStrategyDetail(strategyId);
        });
      });
      
      // Close detail button
      if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', function() {
          strategyDetailOverlay.style.display = 'none';
        });
      }
    }
    
    // Function to show strategy detail
    function showStrategyDetail(strategyId) {
      const strategy = strategyData[strategyId];
      
      // Update strategy detail content
      const detailTitle = document.querySelector('.strategy-detail-title');
      const detailRiskLevel = document.querySelector('.strategy-detail-info .risk-level');
      const detailReturn = document.querySelector('.strategy-detail-info .return-value');
      const detailDuration = document.querySelector('.strategy-detail-info .duration');
      const detailDescription = document.querySelector('.strategy-description p');
      
      detailTitle.textContent = strategy.title;
      detailRiskLevel.textContent = `Risk level: ${strategy.riskLevel}`;
      detailReturn.textContent = `Return: ${strategy.return}`;
      detailDuration.textContent = `Duration: ${strategy.duration}`;
      detailDescription.textContent = strategy.description;
      
      // Show strategy detail overlay
      strategyDetailOverlay.style.display = 'flex';
    }
    
    // Initialize AI analysis button logic
    function initAIAnalysis() {
      const suggestBtn = document.getElementById('suggestBtn');
      const aiAnalysisOverlay = document.getElementById('aiAnalysisOverlay');

      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error("User ID not found in localStorage");

      if (suggestBtn) {
        suggestBtn.addEventListener('click', async function () {
          try {
            aiAnalysisOverlay.style.display = 'flex';
            document.querySelector('main').classList.add('content-dimmed');

            const profileRes = await fetch(`http://localhost:5000/api/financial-profile/${userId}`);
            const profileData = await profileRes.json();
            if (!profileRes.ok) throw new Error('Failed to fetch profile');

            console.log('✅ Fetched user profile:', profileData);

            const payload = {
              employment_status: profileData.employment_status,
              monthly_income: profileData.monthly_income,
              monthly_expenses: profileData.monthly_expenses,
              goal_types: profileData.goal_types,
              target_amount: profileData.target_amount,
              target_duration: profileData.target_duration,
              risk_tolerance: profileData.risk_tolerance,
              investment_experience: profileData.investment_experience,
              savings_investment: profileData.savings_investment,
              existing_loans: profileData.existing_loans,
              financial_discipline: profileData.financial_discipline
            };

            const predictRes = await fetch('http://localhost:5000/api/predict', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            });

            console.log('📡 Raw predict response:', predictRes);

            const text = await predictRes.text();
            console.log('📨 Raw predict response body:', text);

            let predictResult;
            try {
              predictResult = JSON.parse(text);
            } catch (err) {
              throw new Error('❌ Failed to parse JSON from prediction API');
            }

            if (!predictRes.ok) throw new Error('Prediction failed');

            console.log('🤖 AI prediction result:', predictResult);

            // ✅ FIX: Use direct object instead of .strategy
            const strategy = predictResult.strategy;

            setTimeout(() => {
              aiAnalysisOverlay.style.display = 'none';
              document.querySelector('main').classList.remove('content-dimmed');

              document.querySelector('.strategy-detail-title').textContent = strategy.strategy_name;
              document.querySelector('.strategy-detail-info .risk-level').textContent = `Risk level: ${strategy.risk_tolerance}`;
              document.querySelector('.strategy-detail-info .return-value').textContent = `Return: ${strategy.return_rate}%`;
              document.querySelector('.strategy-detail-info .duration').textContent = `Duration: ${strategy.duration_year} year(s)`;
              document.querySelector('.strategy-description p').textContent = strategy.strategy_description;

              document.getElementById('strategyDetailOverlay').style.display = 'flex';
            }, 3000);

                                  
          } catch (error) {
            console.error('🚨 Error during AI analysis:', error.message || error);
            console.error(error.stack || '');
            aiAnalysisOverlay.style.display = 'none';
            document.querySelector('main').classList.remove('content-dimmed');
            alert('Something went wrong while analyzing strategy.');
          }
        });
      }
    }

    // Call this after DOM is ready
    document.addEventListener('DOMContentLoaded', initAIAnalysis);
      
    // Initialize all functionality
    function init() {
      initSortDropdown();
      initViewDetailButtons();
      initAIAnalysis();
      
      // Set first sort option as active
      if (sortOptions.length > 0) {
        sortOptions[0].classList.add('active');
      }
    }

    customizeBtn.addEventListener("click", () => {
      customizeOverlay.style.display = "flex";
    });

    closeCustomizeBtn.addEventListener("click", () => {
      customizeOverlay.style.display = "none";
    });

    document.getElementById("customForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const preferredRisk = document.getElementById("riskSelect").value;
      const preferredDuration = document.getElementById("durationInput").value;

      const customizeOverlay = document.getElementById("customizeOverlay");
      customizeOverlay.style.display = "none";

      // Show AI overlay
      const aiOverlay = document.getElementById("aiAnalysisOverlay");
      aiOverlay.style.display = "flex";
      document.querySelector('main').classList.add('content-dimmed');

      const response = await fetch("http://localhost:5000/api/customize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          risk_tolerance: preferredRisk.toLowerCase(),
          duration_year: preferredDuration,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert("❌ Failed to customize strategy: " + data.message);
        aiOverlay.style.display = "none";
        return;
      }
      const strategy = data.strategy;

      setTimeout(() => {
        aiOverlay.style.display = "none";
        document.querySelector("main").classList.remove("content-dimmed");
        document.querySelector(".strategy-detail-title").textContent = strategy.strategy_name;
        document.querySelector(".strategy-detail-info .risk-level").textContent = `Risk level: ${strategy.risk_level}`;
        document.querySelector(".strategy-detail-info .return-value").textContent = `Return: ${strategy.return_rate}%`;
        document.querySelector(".strategy-detail-info .duration").textContent = `Duration: ${strategy.duration_years} year(s)`;
        document.querySelector(".strategy-description p").textContent = strategy.strategy_description;
        document.getElementById("customizeOverlay").style.display = "none";
        document.getElementById("strategyDetailOverlay").style.display = "flex";
      }, 3000);
    });
    
    // Run initialization
    init();
  });