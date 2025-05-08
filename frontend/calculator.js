
document.addEventListener("DOMContentLoaded", () => {
  // Get form elements
  const roiForm = document.getElementById("roi-form")
  const initialInvestment = document.getElementById("initial-investment")
  const interestRate = document.getElementById("interest-rate")
  const duration = document.getElementById("duration")
  const monthlyRadio = document.getElementById("monthly")
  const yearlyRadio = document.getElementById("yearly")
  const contributionAmountContainer = document.getElementById("contribution-amount-container")
  const contributionAmount = document.getElementById("contribution-amount")
  const exportBtn = document.getElementById("export-btn")
  const resultsSection = document.getElementById("results-section")

  // Result elements
  const finalValueEl = document.getElementById("final-value")
  const totalContributionsEl = document.getElementById("total-contributions")
  const totalInterestEl = document.getElementById("total-interest")
  const cagrEl = document.getElementById("cagr")

  // Chart elements
  let growthChart = null
  let breakdownChart = null
  let yearlyComparisonChart = null

  // Show contribution amount field when frequency is selected
  ;[monthlyRadio, yearlyRadio].forEach((radio) => {
    radio.addEventListener("change", () => {
      contributionAmountContainer.style.display = "block"
    })
  })

  // Form submission
  roiForm.addEventListener("submit", (e) => {
    e.preventDefault()

    try {
      // Get form values
      const initial = Number.parseFloat(initialInvestment.value)
      const rate = Number.parseFloat(interestRate.value) / 100 // Convert percentage to decimal
      const years = Number.parseInt(duration.value)
      const frequency = monthlyRadio.checked ? "monthly" : yearlyRadio.checked ? "yearly" : null
      const additionalAmount =
        contributionAmountContainer.style.display !== "none" ? Number.parseFloat(contributionAmount.value) : 0

      // Validate inputs
      if (isNaN(initial) || isNaN(rate) || isNaN(years)) {
        throw new Error("Please enter valid numbers for all fields")
      }

      if (initial <= 0) {
        throw new Error("Initial investment must be greater than zero")
      }

      if (rate < 0) {
        throw new Error("Interest rate cannot be negative")
      }

      if (years <= 0) {
        throw new Error("Duration must be greater than zero")
      }

      if ((frequency === "monthly" || frequency === "yearly") && (isNaN(additionalAmount) || additionalAmount < 0)) {
        throw new Error("Please enter a valid contribution amount")
      }

      // Calculate ROI
      const result = calculateROI(initial, rate, years, frequency, additionalAmount)

      // Display results
      finalValueEl.textContent = `RM ${result.finalValue.toFixed(0)}`
      totalContributionsEl.textContent = `RM ${result.totalContributions.toFixed(0)} `
      totalInterestEl.textContent = `RM ${result.totalInterest.toFixed(0)} `
      cagrEl.textContent = `${result.cagr.toFixed(2)}% `

      // Add icons to elements
      totalContributionsEl.innerHTML += '<i class="fas fa-arrow-up-right text-success ms-2"></i>'
      totalInterestEl.innerHTML += '<i class="fas fa-arrow-up-right text-success ms-2"></i>'
      cagrEl.innerHTML += '<i class="fas fa-arrow-up-right text-success ms-2"></i>'

      // Generate chart data
      const yearlyData = generateYearlyData(initial, rate, years, frequency, additionalAmount)

      // Create or update charts
      createGrowthChart(yearlyData)
      createBreakdownChart(result.totalContributions, result.totalInterest)
      createYearlyComparisonChart(yearlyData)

      // Show results section
      resultsSection.style.display = "block"

      // Scroll to results
      resultsSection.scrollIntoView({ behavior: "smooth" })
    } catch (error) {
      console.error("Error calculating ROI:", error)
      alert(error.message || "Error calculating ROI. Please check your inputs.")
    }
  })

  // ROI calculation function
  function calculateROI(initialInvestment, rate, duration, contributionFrequency, contributionAmount) {
    let finalValue = initialInvestment
    let totalContributions = initialInvestment

    if (!contributionFrequency || contributionAmount <= 0) {
      // Simple compound interest without additional contributions
      finalValue = initialInvestment * Math.pow(1 + rate, duration)
    } else {
      // Compound interest with regular contributions
      if (contributionFrequency === "monthly") {
        // Monthly contributions
        const monthlyRate = rate / 12
        const totalMonths = duration * 12

        for (let i = 0; i < totalMonths; i++) {
          finalValue = finalValue * (1 + monthlyRate) + contributionAmount
          totalContributions += contributionAmount
        }
      } else {
        // Yearly contributions
        for (let i = 0; i < duration; i++) {
          finalValue = finalValue * (1 + rate)
          if (i < duration - 1) {
            // Add contribution at the end of each year except the last
            finalValue += contributionAmount
            totalContributions += contributionAmount
          }
        }
      }
    }

    // Calculate total interest earned
    const totalInterest = finalValue - totalContributions

    // Calculate CAGR (Compound Annual Growth Rate)
    const cagr = (Math.pow(finalValue / initialInvestment, 1 / duration) - 1) * 100

    return {
      finalValue,
      totalContributions,
      totalInterest,
      cagr,
    }
  }

  // Generate yearly data for charts
  function generateYearlyData(initialInvestment, rate, duration, contributionFrequency, contributionAmount) {
    const yearlyData = []
    let currentValue = initialInvestment
    let totalContributions = initialInvestment
    let yearlyContributions = 0
    let yearlyInterest = 0

    // Add initial year (year 0)
    yearlyData.push({
      year: 0,
      totalValue: currentValue,
      totalContributions: totalContributions,
      yearlyContribution: 0,
      yearlyInterest: 0,
      cumulativeInterest: 0,
    })

    if (!contributionFrequency || contributionAmount <= 0) {
      // Simple compound interest without additional contributions
      for (let year = 1; year <= duration; year++) {
        const previousValue = currentValue
        currentValue = previousValue * (1 + rate)
        yearlyInterest = currentValue - previousValue

        yearlyData.push({
          year: year,
          totalValue: currentValue,
          totalContributions: totalContributions,
          yearlyContribution: 0,
          yearlyInterest: yearlyInterest,
          cumulativeInterest: currentValue - totalContributions,
        })
      }
    } else if (contributionFrequency === "yearly") {
      // Yearly contributions
      for (let year = 1; year <= duration; year++) {
        const previousValue = currentValue
        currentValue = previousValue * (1 + rate)
        yearlyInterest = currentValue - previousValue

        // Add yearly contribution (except for the last year)
        if (year < duration) {
          yearlyContributions = contributionAmount
          currentValue += contributionAmount
          totalContributions += contributionAmount
        } else {
          yearlyContributions = 0
        }

        yearlyData.push({
          year: year,
          totalValue: currentValue,
          totalContributions: totalContributions,
          yearlyContribution: yearlyContributions,
          yearlyInterest: yearlyInterest,
          cumulativeInterest: currentValue - totalContributions,
        })
      }
    } else if (contributionFrequency === "monthly") {
      // Monthly contributions
      const monthlyRate = rate / 12

      for (let year = 1; year <= duration; year++) {
        const startOfYearValue = currentValue
        yearlyContributions = 0

        // Calculate 12 months for each year
        for (let month = 0; month < 12; month++) {
          currentValue = currentValue * (1 + monthlyRate)
          currentValue += contributionAmount
          yearlyContributions += contributionAmount
          totalContributions += contributionAmount
        }

        yearlyInterest = currentValue - startOfYearValue - yearlyContributions

        yearlyData.push({
          year: year,
          totalValue: currentValue,
          totalContributions: totalContributions,
          yearlyContribution: yearlyContributions,
          yearlyInterest: yearlyInterest,
          cumulativeInterest: currentValue - totalContributions,
        })
      }
    }

    return yearlyData
  }

  // Create growth chart
  function createGrowthChart(yearlyData) {
    const ctx = document.getElementById("growthChart").getContext("2d")

    // Prepare data
    const labels = yearlyData.map((data) => `Year ${data.year}`)
    const totalValues = yearlyData.map((data) => data.totalValue)
    const contributionsData = yearlyData.map((data) => data.totalContributions)
    const interestData = yearlyData.map((data) => data.cumulativeInterest)

    // Destroy existing chart if it exists
    if (growthChart) {
      growthChart.destroy()
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
          },
          {
            label: "Total Contributions",
            data: contributionsData,
            borderColor: "#64748b",
            backgroundColor: "rgba(100, 116, 139, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: RM ${context.parsed.y.toFixed(2)}`,
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
              callback: (value) => "RM " + value.toLocaleString(),
            },
          },
        },
      },
    })
  }

  // Create breakdown chart
  function createBreakdownChart(totalContributions, totalInterest) {
    const ctx = document.getElementById("breakdownChart").getContext("2d")

    // Destroy existing chart if it exists
    if (breakdownChart) {
      breakdownChart.destroy()
    }

    // Create new chart
    breakdownChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Principal", "Interest"],
        datasets: [
          {
            data: [totalContributions, totalInterest],
            backgroundColor: ["#64748b", "#22c55e"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return `${context.label}: RM ${value.toFixed(2)} (${percentage}%)`
              },
            },
          },
        },
      },
    })
  }

  // Create yearly comparison chart
  function createYearlyComparisonChart(yearlyData) {
    const ctx = document.getElementById("yearlyComparisonChart").getContext("2d")

    // Prepare data (exclude year 0)
    const filteredData = yearlyData.filter((data) => data.year > 0)
    const labels = filteredData.map((data) => `Year ${data.year}`)
    const contributionsData = filteredData.map((data) => data.yearlyContribution)
    const interestData = filteredData.map((data) => data.yearlyInterest)

    // Destroy existing chart if it exists
    if (yearlyComparisonChart) {
      yearlyComparisonChart.destroy()
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
          },
          {
            label: "Yearly Interest",
            data: interestData,
            backgroundColor: "#22c55e",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: RM ${context.parsed.y.toFixed(2)}`,
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
              callback: (value) => "RM " + value.toLocaleString(),
            },
          },
        },
      },
    })
  }

  // Export functionality
  exportBtn.addEventListener("click", () => {
    if (resultsSection.style.display === "none") {
      alert("Please calculate ROI first before exporting.")
      return
    }

    try {
      // Create PDF using jsPDF
      const { jsPDF } = window.jspdf
      const doc = new jsPDF()

      // Add content to PDF
      doc.setFontSize(22)
      doc.setTextColor(37, 99, 235)
      doc.text("ROI Calculator Results", 20, 20)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`Initial Investment: RM ${initialInvestment.value}`, 20, 40)
      doc.text(`Annual Interest Rate: ${interestRate.value}%`, 20, 50)
      doc.text(`Investment Duration: ${duration.value} years`, 20, 60)

      if (contributionAmountContainer.style.display !== "none") {
        const frequency = monthlyRadio.checked ? "Monthly" : "Yearly"
        doc.text(`Additional Contributions: RM ${contributionAmount.value} (${frequency})`, 20, 70)
      }

      doc.setFontSize(16)
      doc.setTextColor(37, 99, 235)
      doc.text("Results", 20, 90)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(
        `Final Value: ${finalValueEl.textContent.split(" ")[0]} ${finalValueEl.textContent.split(" ")[1]}`,
        20,
        110,
      )
      doc.text(
        `Total Contributions: ${totalContributionsEl.textContent.split(" ")[0]} ${totalContributionsEl.textContent.split(" ")[1]}`,
        20,
        120,
      )
      doc.text(
        `Total Interest Earned: ${totalInterestEl.textContent.split(" ")[0]} ${totalInterestEl.textContent.split(" ")[1]}`,
        20,
        130,
      )
      doc.text(`CAGR / Effective Annual Rate: ${cagrEl.textContent.split(" ")[0]}`, 20, 140)

      // Add charts to PDF
      try {
        // Add growth chart
        const growthChartImg = document.getElementById("growthChart").toDataURL("image/png")
        doc.addPage()
        doc.setFontSize(16)
        doc.setTextColor(37, 99, 235)
        doc.text("Investment Growth Over Time", 20, 20)
        doc.addImage(growthChartImg, "PNG", 20, 30, 170, 100)

        // Add breakdown chart
        const breakdownChartImg = document.getElementById("breakdownChart").toDataURL("image/png")
        doc.addImage(breakdownChartImg, "PNG", 20, 150, 80, 80)

        // Add yearly comparison chart
        const yearlyChartImg = document.getElementById("yearlyComparisonChart").toDataURL("image/png")
        doc.addImage(yearlyChartImg, "PNG", 110, 150, 80, 80)
      } catch (chartError) {
        console.error("Error adding charts to PDF:", chartError)
        // Continue without charts if there's an error
      }

      // Add footer
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text("Generated by 5NANCE ROI Calculator", 20, 280)

      // Save the PDF
      doc.save("roi-calculator-results.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please make sure jsPDF is loaded correctly.")
    }
  })
})
