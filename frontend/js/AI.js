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
    
    // Strategy data
    const strategyData = {
      1: {
        title: "Strategy 1",
        riskLevel: "Moderate",
        return: "7.0%",
        duration: "5 years",
        description: "Conservative investment using bonds and fixed deposit.",
        rating: 0,
        bookmarked: false,
        recommended: true,
        addedToPlan: false
      },
      2: {
        title: "Strategy 2",
        riskLevel: "Moderate",
        return: "7.0%",
        duration: "5 years",
        description: "Balanced portfolio with mix of stocks and bonds.",
        rating: 0,
        bookmarked: false,
        recommended: false,
        addedToPlan: false
      },
      3: {
        title: "Strategy 3",
        riskLevel: "Moderate",
        return: "7.0%",
        duration: "5 years",
        description: "Growth-focused strategy with higher stock allocation.",
        rating: 0,
        bookmarked: false,
        recommended: false,
        addedToPlan: false
      },
      4: {
        title: "Strategy 4",
        riskLevel: "Moderate",
        return: "7.0%",
        duration: "5 years",
        description: "Aggressive growth strategy with focus on emerging markets.",
        rating: 0,
        bookmarked: false,
        recommended: false,
        addedToPlan: false
      }
    };
    
    // Initialize star ratings
    function initRatings() {
      const ratingContainers = document.querySelectorAll('.rating');
      
      ratingContainers.forEach(container => {
        const stars = container.querySelectorAll('.rating-star');
        const strategyId = container.closest('.strategy-card').dataset.strategy;
        
        // Set initial rating if any
        updateStarDisplay(container, strategyData[strategyId].rating);
        
        // Add event listeners to stars
        stars.forEach(star => {
          star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.index);
            const strategyId = this.closest('.strategy-card').dataset.strategy;
            
            // Update data
            strategyData[strategyId].rating = rating;
            
            // Update display
            updateStarDisplay(container, rating);
            
            console.log(`Strategy ${strategyId} rated ${rating} stars`);
          });
          
          // Hover effect
          star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.dataset.index);
            
            stars.forEach(s => {
              if (parseInt(s.dataset.index) <= hoverRating) {
                s.classList.add('active');
              } else {
                s.classList.remove('active');
              }
            });
          });
        });
        
        container.addEventListener('mouseleave', function() {
          const currentRating = parseInt(container.dataset.rating);
          updateStarDisplay(container, currentRating);
        });
      });
    }
    
    // Update star display based on rating
    function updateStarDisplay(container, rating) {
      container.dataset.rating = rating;
      const stars = container.querySelectorAll('.rating-star');
      
      stars.forEach(star => {
        const starIndex = parseInt(star.dataset.index);
        if (starIndex <= rating) {
          star.classList.add('active');
          star.classList.remove('bi-star');
          star.classList.add('bi-star-fill');
        } else {
          star.classList.remove('active');
          star.classList.remove('bi-star-fill');
          star.classList.add('bi-star');
        }
      });
    }
    
    // Initialize bookmarks
    function initBookmarks() {
      const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
      
      bookmarkButtons.forEach(button => {
        const strategyId = button.closest('.strategy-card').dataset.strategy;
        const icon = button.querySelector('i');
        
        // Set initial state
        if (strategyData[strategyId].bookmarked) {
          icon.classList.remove('bi-bookmark');
          icon.classList.add('bi-bookmark-fill');
          icon.style.color = '#0328ee'; // Primary color
        }
        
        // Add click event
        button.addEventListener('click', function() {
          const strategyId = this.closest('.strategy-card').dataset.strategy;
          const icon = this.querySelector('i');
          
          // Toggle bookmark state
          strategyData[strategyId].bookmarked = !strategyData[strategyId].bookmarked;
          
          // Update icon
          if (strategyData[strategyId].bookmarked) {
            icon.classList.remove('bi-bookmark');
            icon.classList.add('bi-bookmark-fill');
            icon.style.color = '#ff0000'; // Primary color
          } else {
            icon.classList.remove('bi-bookmark-fill');
            icon.classList.add('bi-bookmark');
            icon.style.color = '';
          }
          
          // Add animation
          icon.classList.add('bookmark-animation');
          setTimeout(() => {
            icon.classList.remove('bookmark-animation');
          }, 300);
          
          console.log(`Strategy ${strategyId} bookmark ${strategyData[strategyId].bookmarked ? 'added' : 'removed'}`);
        });
      });
    }
    
    // Initialize Add to Plan buttons
    function initAddToPlan() {
      const addPlanButtons = document.querySelectorAll('.add-plan-btn');
      
      addPlanButtons.forEach(button => {
        const strategyId = button.closest('.strategy-card').dataset.strategy;
        
        // Set initial state if already added to plan
        if (strategyData[strategyId].addedToPlan) {
          button.innerHTML = 'Added ✓';
          button.classList.add('btn-success');
          button.classList.remove('btn-outline-primary');
        }
        
        // Add click event
        button.addEventListener('click', function() {
          const strategyId = this.closest('.strategy-card').dataset.strategy;
          
          // Toggle added to plan state
          strategyData[strategyId].addedToPlan = !strategyData[strategyId].addedToPlan;
          
          if (strategyData[strategyId].addedToPlan) {
            // Update button appearance
            this.innerHTML = 'Added ✓';
            this.classList.add('btn-success');
            this.classList.remove('btn-outline-primary');
            
            console.log(`Strategy ${strategyId} added to plan`);
          } else {
            // Update button appearance
            this.innerHTML = 'Add to plan <span>⊕</span>';
            this.classList.remove('btn-success');
            this.classList.add('btn-outline-primary');
            
            console.log(`Strategy ${strategyId} removed from plan`);
          }
        });
      });
    }
    
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
      
      // Sort based on criteria
      switch(sortType) {
        case 'highest-return':
          strategiesArray.sort((a, b) => parseFloat(b.return) - parseFloat(a.return));
          break;
        case 'lowest-risk':
          // This is a placeholder - in a real app, you'd have risk levels as numbers
          strategiesArray.sort((a, b) => a.riskLevel.localeCompare(b.riskLevel));
          break;
        case 'shortest-duration':
          strategiesArray.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
          break;
        case 'highest-rating':
          strategiesArray.sort((a, b) => b.rating - a.rating);
          break;
        case 'recommended':
          strategiesArray.sort((a, b) => b.recommended - a.recommended);
          break;
        default:
          break;
      }
      
      // Reorder DOM elements based on sort
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
    
    // Initialize AI analysis
    function initAIAnalysis() {
      // Suggest Matching Strategy button click
      if (suggestBtn) {
        suggestBtn.addEventListener('click', function() {
          // Show AI analysis overlay
          aiAnalysisOverlay.style.display = 'flex';
          
          // Add dimmed class to main content
          document.querySelector('main').classList.add('content-dimmed');
          
          // Simulate AI analysis (3 seconds)
          setTimeout(function() {
            // Hide AI analysis overlay
            aiAnalysisOverlay.style.display = 'none';
            
            // Remove dimmed class from main content
            document.querySelector('main').classList.remove('content-dimmed');
            
            // Show strategy detail for Strategy 1 (the recommended one)
            showStrategyDetail(1);
          }, 3000);
        });
      }
    }
    
    // Initialize all functionality
    function init() {
      initRatings();
      initBookmarks();
      initAddToPlan();
      initSortDropdown();
      initViewDetailButtons();
      initAIAnalysis();
      
      // Set first sort option as active
      if (sortOptions.length > 0) {
        sortOptions[0].classList.add('active');
      }
    }
    
    // Run initialization
    init();
  });