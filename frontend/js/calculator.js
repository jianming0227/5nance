document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animations
  // AOS is assumed to be available globally or imported elsewhere
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  } else {
    console.warn("AOS is not defined. Ensure it is properly imported or included.");
  }

  // Initialize tooltips
  // tippy is assumed to be available globally or imported elsewhere
  if (typeof tippy !== 'undefined') {
    tippy('[data-tippy-content]', {
      placement: 'top',
      animation: 'scale',
      theme: 'light'
    });
  } else {
    console.warn("tippy is not defined. Ensure it is properly imported or included.");
  }

  // Navbar scroll effect
  /*const navbar = document.querySelector('.custom-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });*/

  // Get form elements
  const roiForm = document.getElementById("roi-form");
  const initialInvestment = document.getElementById("initial-investment");
  const interestRate = document.getElementById("interest-rate");
  const duration = document.getElementById("duration");
  const enableContributions = document.getElementById("enable-contributions");
  const contributionOptions = document.getElementById("contribution-options");
  const monthlyRadio = document.getElementById("monthly");
  const yearlyRadio = document.getElementById("yearly");
  const contributionAmountContainer = document.getElementById("contribution-amount-container");
  const contributionAmount = document.getElementById("contribution-amount");
  const enableInflation = document.getElementById("enable-inflation");
  const inflationContainer = document.getElementById("inflation-container");
  const inflationRate = document.getElementById("inflation-rate");
  const exportBtn = document.getElementById("export-btn");
  const resetBtn = document.getElementById("reset-btn");
  const resultsSection = document.getElementById("results-section");
  const comparisonSection = document.getElementById("comparison-section");
  const loadingOverlay = document.getElementById("loading-overlay");
  const scrollToCalculator = document.getElementById("scroll-to-calculator");
  const showTutorial = document.getElementById("show-tutorial");
  const startCalculating = document.getElementById("start-calculating");

  // Result elements
  const finalValueEl = document.getElementById("final-value");
  const finalValuePercentEl = document.getElementById("final-value-percent");
  const totalContributionsEl = document.getElementById("total-contributions");
  const totalInterestEl = document.getElementById("total-interest");
  const roiPercentEl = document.getElementById("roi-percent");
  const cagrEl = document.getElementById("cagr");
  const inflationAdjustedCagrEl = document.getElementById("inflation-adjusted-cagr");

  // Chart elements
  let growthChart = null;
  let breakdownChart = null;
  let compositionChart = null;
  let yearlyComparisonChart = null;
  let comparisonChart = null;

  // Initialize Swiper
  // Swiper is assumed to be available globally or imported elsewhere
  if (typeof Swiper !== 'undefined') {
    const swiper = new Swiper('.feature-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
      }
    });
  } else {
    console.warn("Swiper is not defined. Ensure it is properly imported or included.");
  }

  // Initialize noUiSlider for Initial Investment
  const initialInvestmentSlider = document.getElementById('initial-investment-slider');
  // noUiSlider is assumed to be available globally or imported elsewhere
  if (typeof noUiSlider !== 'undefined') {
    // Initialize noUiSlider for Interest Rate
    const interestRateSlider = document.getElementById('interest-rate-slider');
    // Initialize noUiSlider for Duration
    const durationSlider = document.getElementById('duration-slider');
    // Initialize noUiSlider for Contribution Amount
    const contributionAmountSlider = document.getElementById('contribution-amount-slider');
    // Initialize noUiSlider for Inflation Rate
    const inflationRateSlider = document.getElementById('inflation-rate-slider');

    noUiSlider.create(initialInvestmentSlider, {
      start: [10000],
      connect: [true, false],
      step: 1000,
      range: {
        'min': [1000],
        '25%': [10000],
        '50%': [50000],
        '75%': [250000],
        'max': [1000000]
      },
      format: {
        to: function (value) {
          return Math.round(value);
        },
        from: function (value) {
          return Number(value);
        }
      }
    });

    noUiSlider.create(interestRateSlider, {
      start: [7],
      connect: [true, false],
      step: 0.1,
      range: {
        'min': [1],
        '25%': [3],
        '50%': [7],
        '75%': [12],
        'max': [20]
      },
      format: {
        to: function (value) {
          return value.toFixed(1);
        },
        from: function (value) {
          return Number(value);
        }
      }
    });

    noUiSlider.create(durationSlider, {
      start: [10],
      connect: [true, false],
      step: 1,
      range: {
        'min': [1],
        '25%': [5],
        '50%': [10],
        '75%': [20],
        'max': [30]
      },
      format: {
        to: function (value) {
          return Math.round(value);
        },
        from: function (value) {
          return Number(value);
        }
      }
    });

    noUiSlider.create(contributionAmountSlider, {
      start: [500],
      connect: [true, false],
      step: 100,
      range: {
        'min': [100],
        '25%': [500],
        '50%': [1000],
        '75%': [5000],
        'max': [10000]
      },
      format: {
        to: function (value) {
          return Math.round(value);
        },
        from: function (value) {
          return Number(value);
        }
      }
    });

    noUiSlider.create(inflationRateSlider, {
      start: [2.5],
      connect: [true, false],
      step: 0.1,
      range: {
        'min': [0],
        '25%': [1],
        '50%': [2.5],
        '75%': [5],
        'max': [10]
      },
      format: {
        to: function (value) {
          return value.toFixed(1);
        },
        from: function (value) {
          return Number(value);
        }
      }
    });

    // Connect sliders to input fields
    initialInvestmentSlider.noUiSlider.on('update', function (values, handle) {
      initialInvestment.value = values[handle];
    });

    interestRateSlider.noUiSlider.on('update', function (values, handle) {
      interestRate.value = values[handle];
    });

    durationSlider.noUiSlider.on('update', function (values, handle) {
      duration.value = values[handle];
    });

    contributionAmountSlider.noUiSlider.on('update', function (values, handle) {
      contributionAmount.value = values[handle];
    });

    inflationRateSlider.noUiSlider.on('update', function (values, handle) {
      inflationRate.value = values[handle];
    });

    // Connect input fields to sliders
    initialInvestment.addEventListener('change', function () {
      initialInvestmentSlider.noUiSlider.set(this.value);
    });

    interestRate.addEventListener('change', function () {
      interestRateSlider.noUiSlider.set(this.value);
    });

    duration.addEventListener('change', function () {
      durationSlider.noUiSlider.set(this.value);
    });

    contributionAmount.addEventListener('change', function () {
      contributionAmountSlider.noUiSlider.set(this.value);
    });

    inflationRate.addEventListener('change', function () {
      inflationRateSlider.noUiSlider.set(this.value);
    });
  } else {
    console.warn("noUiSlider is not defined. Ensure it is properly imported or included.");
  }

  // Toggle contribution options
  enableContributions.addEventListener("change", () => {
    contributionOptions.style.display = enableContributions.checked ? "block" : "none";
    if (!enableContributions.checked) {
      contributionAmountContainer.style.display = "none";
      monthlyRadio.checked = false;
      yearlyRadio.checked = false;
    }
  });

  // Show contribution amount field when frequency is selected
  [monthlyRadio, yearlyRadio].forEach((radio) => {
    radio.addEventListener("change", () => {
      contributionAmountContainer.style.display = "block";
    });
  });

  // Toggle inflation options
  enableInflation.addEventListener("change", () => {
    inflationContainer.style.display = enableInflation.checked ? "block" : "none";
  });

  // Scroll to calculator section
  scrollToCalculator.addEventListener("click", () => {
    document.getElementById("calculator-section").scrollIntoView({ behavior: "smooth" });
  });

  // Show tutorial modal
  showTutorial.addEventListener("click", () => {
    // bootstrap is assumed to be available globally or imported elsewhere
    if (typeof bootstrap !== 'undefined') {
      const tutorialModal = new bootstrap.Modal(document.getElementById('tutorialModal'));
      tutorialModal.show();
    } else {
      console.warn("bootstrap is not defined. Ensure it is properly imported or included.");
    }
  });

  // Start calculating from tutorial
  startCalculating.addEventListener("click", () => {
    document.getElementById("calculator-section").scrollIntoView({ behavior: "smooth" });
  });

  // Reset form
  resetBtn.addEventListener("click", () => {
    roiForm.reset();
    if (typeof noUiSlider !== 'undefined') {
      initialInvestmentSlider.noUiSlider.set(10000);
      interestRateSlider.noUiSlider.set(7);
      durationSlider.noUiSlider.set(10);
      contributionAmountSlider.noUiSlider.set(500);
      inflationRateSlider.noUiSlider.set(2.5);
    }
    
    enableContributions.checked = false;
    contributionOptions.style.display = "none";
    contributionAmountContainer.style.display = "none";
    
    enableInflation.checked = false;
    inflationContainer.style.display = "none";
    
    resultsSection.style.display = "none";
    comparisonSection.style.display = "none";
  });

  // Form submission
  roiForm.addEventListener("submit", (e) => {
    e.preventDefault();

    try {
      // Show loading overlay
      loadingOverlay.style.display = "flex";

      // Get form values
      const initial = Number.parseFloat(initialInvestment.value);
      const rate = Number.parseFloat(interestRate.value) / 100; // Convert percentage to decimal
      const years = Number.parseInt(duration.value);
      
      let frequency = null;
      let additionalAmount = 0;
      
      if (enableContributions.checked) {
        frequency = monthlyRadio.checked ? "monthly" : yearlyRadio.checked ? "yearly" : null;
        additionalAmount = contributionAmountContainer.style.display !== "none" ? Number.parseFloat(contributionAmount.value) : 0;
      }
      
      const useInflation = enableInflation.checked;
      const inflationRateValue = useInflation ? Number.parseFloat(inflationRate.value) / 100 : 0;

      // Validate inputs
      if (isNaN(initial) || isNaN(rate) || isNaN(years)) {
        throw new Error("Please enter valid numbers for all fields");
      }

      if (initial <= 0) {
        throw new Error("Initial investment must be greater than zero");
      }

      if (rate < 0) {
        throw new Error("Interest rate cannot be negative");
      }

      if (years <= 0) {
        throw new Error("Duration must be greater than zero");
      }

      if ((frequency === "monthly" || frequency === "yearly") && (isNaN(additionalAmount) || additionalAmount < 0)) {
        throw new Error("Please enter a valid contribution amount");
      }

      // Simulate calculation delay for better UX
      setTimeout(() => {
        // Calculate ROI
        const result = calculateROI(initial, rate, years, frequency, additionalAmount, inflationRateValue);

        // Display results with animation
        displayResults(result, initial);

        // Generate chart data
        const yearlyData = generateYearlyData(initial, rate, years, frequency, additionalAmount, inflationRateValue);

        // Create or update charts
        createGrowthChart(yearlyData);
        createBreakdownChart(result.totalContributions, result.totalInterest);
        createCompositionChart(yearlyData);
        createYearlyComparisonChart(yearlyData);
        
        // Create data table
        createDataTable(yearlyData);

        // Setup comparison tool
        setupComparisonTool(initial, rate, years, frequency, additionalAmount);

        // Show results section
        resultsSection.style.display = "block";
        comparisonSection.style.display = "block";

        // Hide loading overlay
        loadingOverlay.style.display = "none";

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }, 1000); // 1 second delay for loading effect
    } catch (error) {
      console.error("Error calculating ROI:", error);
      alert(error.message || "Error calculating ROI. Please check your inputs.");
      loadingOverlay.style.display = "none";
    }
  });

  // Display results with animation
  function displayResults(result, initialValue) {
    // Calculate percentage increase
    const percentIncrease = ((result.finalValue - initialValue) / initialValue) * 100;
    const roiPercent = (result.totalInterest / result.totalContributions) * 100;
    
    // Format values
    const formattedFinalValue = `RM ${formatNumber(result.finalValue)}`;
    const formattedTotalContributions = `RM ${formatNumber(result.totalContributions)}`;
    const formattedTotalInterest = `RM ${formatNumber(result.totalInterest)}`;
    const formattedCagr = `${result.cagr.toFixed(2)}%`;
    const formattedInflationAdjustedCagr = `${result.inflationAdjustedCagr.toFixed(2)}% after inflation`;
    
    // Set text content first (for accessibility)
    finalValueEl.textContent = formattedFinalValue;
    finalValuePercentEl.textContent = `+${percentIncrease.toFixed(0)}%`;
    totalContributionsEl.textContent = formattedTotalContributions;
    totalInterestEl.textContent = formattedTotalInterest;
    roiPercentEl.textContent = `+${roiPercent.toFixed(0)}% ROI`;
    cagrEl.textContent = formattedCagr;
    inflationAdjustedCagrEl.textContent = formattedInflationAdjustedCagr;
    
    // Animate numbers with CountUp.js
    if (typeof CountUp !== 'undefined') {
      new CountUp('final-value', 0, result.finalValue, 0, 2, {
        prefix: 'RM ',
        separator: ',',
      }).start();
      
      new CountUp('total-contributions', 0, result.totalContributions, 0, 2, {
        prefix: 'RM ',
        separator: ',',
      }).start();
      
      new CountUp('total-interest', 0, result.totalInterest, 0, 2, {
        prefix: 'RM ',
        separator: ',',
      }).start();
      
      new CountUp('cagr', 0, result.cagr, 2, 2, {
        suffix: '%',
      }).start();
    } else {
      console.warn("CountUp is not defined. Ensure it is properly imported or included.");
    }
  }

  // Format number with commas
  function formatNumber(num) {
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // ROI calculation function
  function calculateROI(initialInvestment, rate, duration, contributionFrequency, contributionAmount, inflationRate = 0) {
    let finalValue = initialInvestment;
    let totalContributions = initialInvestment;

    if (!contributionFrequency || contributionAmount <= 0) {
      // Simple compound interest without additional contributions
      finalValue = initialInvestment * Math.pow(1 + rate, duration);
    } else {
      // Compound interest with regular contributions
      if (contributionFrequency === "monthly") {
        // Monthly contributions
        const monthlyRate = rate / 12;
        const totalMonths = duration * 12;

        for (let i = 0; i < totalMonths; i++) {
          finalValue = finalValue * (1 + monthlyRate) + contributionAmount;
          totalContributions += contributionAmount;
        }
      } else {
        // Yearly contributions
        for (let i = 0; i < duration; i++) {
          finalValue = finalValue * (1 + rate);
          if (i < duration - 1) {
            // Add contribution at the end of each year except the last
            finalValue += contributionAmount;
            totalContributions += contributionAmount;
          }
        }
      }
    }

    // Calculate total interest earned
    const totalInterest = finalValue - totalContributions;

    // Calculate CAGR (Compound Annual Growth Rate)
    const cagr = (Math.pow(finalValue / initialInvestment, 1 / duration) - 1) * 100;
    
    // Calculate inflation-adjusted CAGR
    const inflationAdjustedCagr = ((1 + (cagr / 100)) / (1 + inflationRate) - 1) * 100;

    return {
      finalValue,
      totalContributions,
      totalInterest,
      cagr,
      inflationAdjustedCagr
    };
  }

  // Generate yearly data for charts
  function generateYearlyData(initialInvestment, rate, duration, contributionFrequency, contributionAmount, inflationRate = 0) {
    const yearlyData = [];
    let currentValue = initialInvestment;
    let totalContributions = initialInvestment;
    let yearlyContributions = 0;
    let yearlyInterest = 0;

    // Add initial year (year 0)
    yearlyData.push({
      year: 0,
      totalValue: currentValue,
      totalContributions: totalContributions,
      yearlyContribution: 0,
      yearlyInterest: 0,
      cumulativeInterest: 0,
      inflationAdjustedValue: currentValue
    });

    if (!contributionFrequency || contributionAmount <= 0) {
      // Simple compound interest without additional contributions
      for (let year = 1; year <= duration; year++) {
        const previousValue = currentValue;
        currentValue = previousValue * (1 + rate);
        yearlyInterest = currentValue - previousValue;
        
        // Calculate inflation-adjusted value
        const inflationAdjustedValue = currentValue / Math.pow(1 + inflationRate, year);

        yearlyData.push({
          year: year,
          totalValue: currentValue,
          totalContributions: totalContributions,
          yearlyContribution: 0,
          yearlyInterest: yearlyInterest,
          cumulativeInterest: currentValue - totalContributions,
          inflationAdjustedValue: inflationAdjustedValue
        });
      }
    } else if (contributionFrequency === "yearly") {
      // Yearly contributions
      for (let year = 1; year <= duration; year++) {
        const previousValue = currentValue;
        currentValue = previousValue * (1 + rate);
        yearlyInterest = currentValue - previousValue;

        // Add yearly contribution (except for the last year)
        if (year < duration) {
          yearlyContributions = contributionAmount;
          currentValue += contributionAmount;
          totalContributions += contributionAmount;
        } else {
          yearlyContributions = 0;
        }
        
        // Calculate inflation-adjusted value
        const inflationAdjustedValue = currentValue / Math.pow(1 + inflationRate, year);

        yearlyData.push({
          year: year,
          totalValue: currentValue,
          totalContributions: totalContributions,
          yearlyContribution: yearlyContributions,
          yearlyInterest: yearlyInterest,
          cumulativeInterest: currentValue - totalContributions,
          inflationAdjustedValue: inflationAdjustedValue
        });
      }
    } else if (contributionFrequency === "monthly") {
      // Monthly contributions
      const monthlyRate = rate / 12;

      for (let year = 1; year <= duration; year++) {
        const startOfYearValue = currentValue;
        yearlyContributions = 0;

        // Calculate 12 months for each year
        for (let month = 0; month < 12; month++) {
          currentValue = currentValue * (1 + monthlyRate);
          currentValue += contributionAmount;
          yearlyContributions += contributionAmount;
          totalContributions += contributionAmount;
        }

        yearlyInterest = currentValue - startOfYearValue - yearlyContributions;
        
        // Calculate inflation-adjusted value
        const inflationAdjustedValue = currentValue / Math.pow(1 + inflationRate, year);

        yearlyData.push({
          year: year,
          totalValue: currentValue,
          totalContributions: totalContributions,
          yearlyContribution: yearlyContributions,
          yearlyInterest: yearlyInterest,
          cumulativeInterest: currentValue - totalContributions,
          inflationAdjustedValue: inflationAdjustedValue
        });
      }
    }

    return yearlyData;
  }

  // Create growth chart
  function createGrowthChart(yearlyData) {
    const ctx = document.getElementById("growthChart").getContext("2d");

    // Prepare data
    const labels = yearlyData.map((data) => `Year ${data.year}`);
    const totalValues = yearlyData.map((data) => data.totalValue);
    const contributionsData = yearlyData.map((data) => data.totalContributions);
    const interestData = yearlyData.map((data) => data.cumulativeInterest);
    const inflationAdjustedValues = yearlyData.map((data) => data.inflationAdjustedValue);

    // Destroy existing chart if it exists
    if (growthChart) {
      growthChart.destroy();
    }

    // Create new chart
    growthChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Value",
            data: totalValues,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            tension: 0.4,
            fill: true,
            borderWidth: 3
          },
          {
            label: "Total Contributions",
            data: contributionsData,
            borderColor: "#64748b",
            backgroundColor: "rgba(100, 116, 139, 0.1)",
            tension: 0.4,
            fill: true,
            borderWidth: 2
          },
          {
            label: "Inflation-Adjusted Value",
            data: inflationAdjustedValues,
            borderColor: "#ef4444",
            borderDash: [5, 5],
            backgroundColor: "transparent",
            tension: 0.4,
            fill: false,
            borderWidth: 2
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: RM ${context.parsed.y.toLocaleString(undefined, {maximumFractionDigits: 0})}`,
            },
          },
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "RM " + value.toLocaleString(undefined, {maximumFractionDigits: 0}),
            },
          },
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        }
      },
    });
  }

  // Create breakdown chart
  function createBreakdownChart(totalContributions, totalInterest) {
    const ctx = document.getElementById("breakdownChart").getContext("2d");

    // Destroy existing chart if it exists
    if (breakdownChart) {
      breakdownChart.destroy();
    }

    // Create new chart
    breakdownChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Principal", "Interest"],
        datasets: [
          {
            data: [totalContributions, totalInterest],
            backgroundColor: ["#64748b", "#22c55e"],
            hoverBackgroundColor: ["#475569", "#16a34a"],
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${context.label}: RM ${value.toLocaleString(undefined, {maximumFractionDigits: 0})} (${percentage}%)`;
              },
            },
          },
          legend: {
            position: 'bottom'
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: 'easeOutQuart'
        }
      },
    });
  }

  // Create composition chart
  function createCompositionChart(yearlyData) {
    const ctx = document.getElementById("compositionChart").getContext("2d");
    
    // Get final values
    const finalData = yearlyData[yearlyData.length - 1];
    const initialInvestmentValue = yearlyData[0].totalValue;
    const additionalContributions = finalData.totalContributions - initialInvestmentValue;
    const interestEarned = finalData.cumulativeInterest;
    
    // Destroy existing chart if it exists
    if (compositionChart) {
      compositionChart.destroy();
    }
    
    // Create new chart
    compositionChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Growth Composition"],
        datasets: [
          {
            label: "Initial Investment",
            data: [initialInvestmentValue],
            backgroundColor: "#3b82f6",
            borderWidth: 0,
          },
          {
            label: "Additional Contributions",
            data: [additionalContributions],
            backgroundColor: "#64748b",
            borderWidth: 0,
          },
          {
            label: "Interest Earned",
            data: [interestEarned],
            backgroundColor: "#22c55e",
            borderWidth: 0,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: RM ${context.raw.toLocaleString(undefined, {maximumFractionDigits: 0})}`,
            },
          },
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              callback: (value) => "RM " + value.toLocaleString(undefined, {maximumFractionDigits: 0}),
            },
          },
          y: {
            stacked: true
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        }
      },
    });
  }

  // Create yearly comparison chart
  function createYearlyComparisonChart(yearlyData) {
    const ctx = document.getElementById("yearlyComparisonChart").getContext("2d");

    // Prepare data (exclude year 0)
    const filteredData = yearlyData.filter((data) => data.year > 0);
    const labels = filteredData.map((data) => `Year ${data.year}`);
    const contributionsData = filteredData.map((data) => data.yearlyContribution);
    const interestData = filteredData.map((data) => data.yearlyInterest);

    // Destroy existing chart if it exists
    if (yearlyComparisonChart) {
      yearlyComparisonChart.destroy();
    }

    // Create new chart
    yearlyComparisonChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Yearly Contribution",
            data: contributionsData,
            backgroundColor: "#64748b",
            borderWidth: 0,
          },
          {
            label: "Yearly Interest",
            data: interestData,
            backgroundColor: "#22c55e",
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: RM ${context.parsed.y.toLocaleString(undefined, {maximumFractionDigits: 0})}`,
            },
          },
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "RM " + value.toLocaleString(undefined, {maximumFractionDigits: 0}),
            },
          },
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        }
      },
    });
  }

  // Create data table
  function createDataTable(yearlyData) {
    const tableBody = document.getElementById("data-table-body");
    tableBody.innerHTML = "";
    
    yearlyData.forEach(data => {
      const row = document.createElement("tr");
      
      // Year
      const yearCell = document.createElement("td");
      yearCell.textContent = data.year;
      row.appendChild(yearCell);
      
      // Starting Balance (previous year's ending balance or initial investment for year 0)
      const startingBalanceCell = document.createElement("td");
      if (data.year === 0) {
        startingBalanceCell.textContent = `RM ${data.totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
      } else {
        startingBalanceCell.textContent = `RM ${yearlyData[data.year - 1].totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
      }
      row.appendChild(startingBalanceCell);
      
      // Contributions
      const contributionsCell = document.createElement("td");
      contributionsCell.textContent = `RM ${data.yearlyContribution.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
      row.appendChild(contributionsCell);
      
      // Interest Earned
      const interestCell = document.createElement("td");
      interestCell.textContent = `RM ${data.yearlyInterest.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
      row.appendChild(interestCell);
      
      // Ending Balance
      const endingBalanceCell = document.createElement("td");
      endingBalanceCell.textContent = `RM ${data.totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
      row.appendChild(endingBalanceCell);
      
      tableBody.appendChild(row);
    });
  }

  // Setup comparison tool
  function setupComparisonTool(initialInvestment, rate, years, frequency, additionalAmount) {
    const comparisonType = document.getElementById("comparison-type");
    const comparisonValues = document.getElementById("comparison-values");
    const runComparisonBtn = document.getElementById("run-comparison");
    
    // Clear previous values
    comparisonValues.innerHTML = "";
    
    // Setup comparison values based on type
    comparisonType.addEventListener("change", () => {
      comparisonValues.innerHTML = "";
      
      if (comparisonType.value === "interest") {
        // Interest rate comparison
        const rates = [rate * 0.5, rate, rate * 1.5, rate * 2];
        rates.forEach(r => {
          const percentage = (r * 100).toFixed(1);
          addComparisonCheckbox(comparisonValues, `interest-${percentage}`, `${percentage}%`, true);
        });
      } else if (comparisonType.value === "duration") {
        // Duration comparison
        const durations = [5, 10, 15, 20, 30].filter(d => d <= 30);
        durations.forEach(d => {
          addComparisonCheckbox(comparisonValues, `duration-${d}`, `${d} years`, d === years);
        });
      } else if (comparisonType.value === "contribution") {
        // Contribution amount comparison
        const amounts = [0, additionalAmount * 0.5, additionalAmount, additionalAmount * 2];
        amounts.forEach(a => {
          addComparisonCheckbox(comparisonValues, `contribution-${a}`, `RM ${a.toLocaleString(undefined, {maximumFractionDigits: 0})}`, a === additionalAmount);
        });
      }
    });
    
    // Trigger change to initialize values
    comparisonType.dispatchEvent(new Event("change"));
    
    // Run comparison
    runComparisonBtn.addEventListener("click", () => {
      const selectedValues = [];
      const checkboxes = comparisonValues.querySelectorAll("input[type=checkbox]:checked");
      
      checkboxes.forEach(checkbox => {
        const [type, value] = checkbox.id.split("-");
        selectedValues.push({
          type,
          value: parseFloat(value),
          label: checkbox.nextElementSibling.textContent
        });
      });
      
      if (selectedValues.length > 0) {
        runComparison(initialInvestment, rate, years, frequency, additionalAmount, selectedValues);
      } else {
        alert("Please select at least one value to compare");
      }
    });
  }
  
  // Add comparison checkbox
  function addComparisonCheckbox(container, id, label, checked) {
    const div = document.createElement("div");
    div.className = "form-check form-check-inline";
    
    const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.id = id;
    input.checked = checked;
    
    const labelEl = document.createElement("label");
    labelEl.className = "form-check-label";
    labelEl.htmlFor = id;
    labelEl.textContent = label;
    
    div.appendChild(input);
    div.appendChild(labelEl);
    container.appendChild(div);
  }
  
  // Run comparison
  function runComparison(initialInvestment, rate, years, frequency, additionalAmount, selectedValues) {
    const ctx = document.getElementById("comparisonChart").getContext("2d");
    
    // Prepare data
    const datasets = [];
    const labels = Array.from({length: years + 1}, (_, i) => `Year ${i}`);
    
    selectedValues.forEach(item => {
      let comparisonData;
      
      if (item.type === "interest") {
        const comparisonRate = item.value / 100;
        comparisonData = generateYearlyData(initialInvestment, comparisonRate, years, frequency, additionalAmount);
      } else if (item.type === "duration") {
        const comparisonYears = item.value;
        comparisonData = generateYearlyData(initialInvestment, rate, comparisonYears, frequency, additionalAmount);
      } else if (item.type === "contribution") {
        const comparisonAmount = item.value;
        comparisonData = generateYearlyData(initialInvestment, rate, years, frequency, comparisonAmount);
      }
      
      const totalValues = comparisonData.map(data => data.totalValue);
      
      // Generate a color based on the index
      const hue = (datasets.length * 137) % 360; // Golden angle approximation for good distribution
      const color = `hsl(${hue}, 70%, 50%)`;
      
      datasets.push({
        label: item.label,
        data: totalValues,
        borderColor: color,
        backgroundColor: `hsla(${hue}, 70%, 50%, 0.1)`,
        tension: 0.4,
        fill: false,
        borderWidth: 3
      });
    });
    
    // Destroy existing chart if it exists
    if (comparisonChart) {
      comparisonChart.destroy();
    }
    
    // Create new chart
    comparisonChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: RM ${context.parsed.y.toLocaleString(undefined, {maximumFractionDigits: 0})}`,
            },
          },
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => "RM " + value.toLocaleString(undefined, {maximumFractionDigits: 0}),
            },
          },
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  // Export functionality
  exportBtn.addEventListener("click", () => {
    if (resultsSection.style.display === "none") {
      alert("Please calculate ROI first before exporting.");
      return;
    }

    try {
      // Show loading overlay
      loadingOverlay.style.display = "flex";
      
      setTimeout(() => {
        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add content to PDF
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235);
        doc.text("ROI Calculator Results", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Initial Investment: RM ${initialInvestment.value}`, 20, 40);
        doc.text(`Annual Interest Rate: ${interestRate.value}%`, 20, 50);
        doc.text(`Investment Duration: ${duration.value} years`, 20, 60);

        if (enableContributions.checked) {
          const frequency = monthlyRadio.checked ? "Monthly" : yearlyRadio.checked ? "Yearly" : "None";
          if (frequency !== "None") {
            doc.text(`Additional Contributions: RM ${contributionAmount.value} (${frequency})`, 20, 70);
          }
        }
        
        if (enableInflation.checked) {
          doc.text(`Inflation Rate: ${inflationRate.value}%`, 20, 80);
        }

        doc.setFontSize(16);
        doc.setTextColor(37, 99, 235);
        doc.text("Results", 20, 100);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Final Value: ${finalValueEl.textContent}`, 20, 120);
        doc.text(`Total Contributions: ${totalContributionsEl.textContent}`, 20, 130);
        doc.text(`Total Interest Earned: ${totalInterestEl.textContent}`, 20, 140);
        doc.text(`CAGR / Effective Annual Rate: ${cagrEl.textContent}`, 20, 150);
        
        if (enableInflation.checked) {
          doc.text(`Inflation-Adjusted CAGR: ${inflationAdjustedCagrEl.textContent}`, 20, 160);
        }

        // Add charts to PDF
        try {
          // Use html2canvas to capture charts
          const html2canvas = window.html2canvas;
          html2canvas(document.getElementById("growthChart").parentNode).then(canvas => {
            const growthChartImg = canvas.toDataURL("image/png");
            doc.addPage();
            doc.setFontSize(16);
            doc.setTextColor(37, 99, 235);
            doc.text("Investment Growth Over Time", 20, 20);
            doc.addImage(growthChartImg, "PNG", 20, 30, 170, 100);
            
            // Capture breakdown chart
            html2canvas(document.getElementById("breakdownChart").parentNode).then(canvas => {
              const breakdownChartImg = canvas.toDataURL("image/png");
              doc.addImage(breakdownChartImg, "PNG", 20, 150, 80, 80);
              
              // Capture yearly comparison chart
              html2canvas(document.getElementById("yearlyComparisonChart").parentNode).then(canvas => {
                const yearlyChartImg = canvas.toDataURL("image/png");
                doc.addImage(yearlyChartImg, "PNG", 110, 150, 80, 80);
                
                // Add footer
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text("Generated by 5NANCE ROI Calculator", 20, 280);
                doc.text(new Date().toLocaleDateString(), 20, 285);
                
                // Save the PDF
                doc.save("roi-calculator-results.pdf");
                
                // Hide loading overlay
                loadingOverlay.style.display = "none";
              });
            });
          });
        } catch (chartError) {
          console.error("Error adding charts to PDF:", chartError);
          // Continue without charts if there's an error
          doc.save("roi-calculator-results.pdf");
          loadingOverlay.style.display = "none";
        }
      }, 1000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please make sure jsPDF is loaded correctly.");
      loadingOverlay.style.display = "none";
    }
  });
});