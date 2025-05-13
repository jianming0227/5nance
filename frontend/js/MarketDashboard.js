const dropdown = document.getElementById('watchlist-dropdown');
const groups = {
    stock: document.getElementById('stock-group'),
    etf: document.getElementById('etf-group'),
    crypto: document.getElementById('crypto-group')
};

dropdown.addEventListener('change', function () {
    const selected = this.value;
    Object.keys(groups).forEach((key) => {
        groups[key].classList.toggle('d-none', key !== selected);
    });

    // Initialize charts based on selected group
    if (selected === "stock") {
        setTimeout(() => {
            stockPieChart()
            stockBarChart()
            stockLineChart()
        }, 100)
    } else if (selected === "etf") {
        setTimeout(() => {
            etfPieChart()
            etfBarChart()
            etfLineChart()
        }, 100)
    } else if (selected === "crypto") {
        setTimeout(() => {
            cryptoPieChart()
            cryptoBarChart()
            cryptoLineChart()
        }, 100)
    }
});

const articlesWrapper = document.getElementById('articlesWrapper');
const scrollAmount = 600; // Set to the width of one article thumbnail

document.getElementById('prevButton').addEventListener('click', () => {
    articlesWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

document.getElementById('nextButton').addEventListener('click', () => {
    articlesWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});


document.addEventListener("DOMContentLoaded", () => {
    // Initialize stock charts by default
    stockPieChart()
    stockBarChart()
    stockLineChart()
})

// Pie Chart for Stock Distribution
function stockPieChart() {
    const pieCtx = document.getElementById('stockPieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['AAPL', 'GOOG', 'NVI', 'SSG', 'MSF'],
            datasets: [{
                label: 'Stock Allocation',
                data: [24.00, 5.00, 16.33, 32.67, 22.00],
                backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745', '#6f42c1']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#FFFFFF",
                    },
                },
                tooltip: {
                    bodyColor: "#FFFFFF",
                    titleColor: "#FFFFFF",
                },
            },
        }
    });
}


// Bar Chart for Stock Prices
function stockBarChart() {
    const barCtx = document.getElementById('stockBarChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['AAPL', 'GOOG', 'NVI', 'SSG', 'MSF'],
            datasets: [{
                label: 'Price (USD)',
                data: [180.45, 130.12, 21.97, 281.01, 48.99],
                backgroundColor: '#007bff',
                borderRadius: 100
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#FFFFFF",
                    },
                },
                tooltip: {
                    bodyColor: "#FFFFFF",
                    titleColor: "#FFFFFF",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#FFFFFF",
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                    },
                },
                x: {
                    ticks: {
                        color: "#FFFFFF",
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                    },
                },
            },
        }
    });
}

// Line Chart for Stock Prices
function stockLineChart() {
    const lineCtx = document.getElementById('stockLineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: [
                {
                    label: 'AAPL',
                    data: [180, 301, 58, 60, 193],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'GOOG',
                    data: [130, 132, 129, 294, 264],
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'NVI',
                    data: [22, 21, 23, 130, 23],
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'SSG',
                    data: [280, 282, 281, 285, 284],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'MSF',
                    data: [321, 49, 47, 50, 28],
                    borderColor: '#6f42c1',
                    backgroundColor: 'rgba(111, 66, 193, 0.1)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#FFFFFF",
          },
        },
        tooltip: {
          bodyColor: "#FFFFFF",
          titleColor: "#FFFFFF",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    }
    });
}

// Pie Chart for ETF Volume Distribution
function etfPieChart() {
    const pieCtx = document.getElementById('etfPieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['iShares Russell 2000', 'SPDR S&P 500', 'Invesco DB Dollar Index Bullish', 'iShares Year Treasury Bond', 'ProShares UltraShort Treasury'],
            datasets: [{
                label: 'Volume (in millions)',
                data: [12.47, 23.81, 18.36, 30.25, 15.11],
                backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745', '#6f42c1']
            }]
        },
        options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#FFFFFF",
          },
        },
        tooltip: {
          bodyColor: "#FFFFFF",
          titleColor: "#FFFFFF",
        },
      },
    }
    });
}


// Bar Chart for ETF Prices
function etfBarChart() {
    const barCtx = document.getElementById('etfBarChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['IWM', 'SPY', 'UUP', 'TLT', 'TBT'],
            datasets: [{
                label: 'Price (USD)',
                data: [412.38, 826.47, 305.12, 289.76, 903.91],
                backgroundColor: '#007bff',
                borderRadius: 100
            }]
        },
        options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#FFFFFF",
          },
        },
        tooltip: {
          bodyColor: "#FFFFFF",
          titleColor: "#FFFFFF",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    }
    });
}

// Line Chart for ETF % Change
function etfLineChart() {
    const lineCtx = document.getElementById('etfLineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['21/04/2025', '22/04/2025', '23/04/2025', '24/04/2025', '25/04/2025', '26/04/2025', '27/04/2025', '28/04/2025', '29/04/2025', '30/04/2025'],
            datasets: [
                {
                    label: 'IWM',
                    data: [+0.82, -1.25, +0.45, +2.13, -0.67, +1.89, -0.34, +0.77, +1.01, -0.92],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'SPY',
                    data: [-1.12, +0.58, +1.34, -0.88, +2.47, -1.03, +0.69, +0.42, -0.29, +1.11],
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'UUP',
                    data: [+0.25, -0.75, +1.96, +0.63, -1.52, +2.21, -0.41, +0.90, +1.28, -0.56],
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'TLT',
                    data: [-0.48, +1.07, +0.33, +2.89, -0.95, +0.12, +1.56, -1.20, +0.83, -0.31],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'TBT',
                    data: [+1.45, -0.63, +0.78, +2.05, -1.10, +0.51, +0.67, -0.84, +1.93, -0.22],
                    borderColor: '#6f42c1',
                    backgroundColor: 'rgba(111, 66, 193, 0.1)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#FFFFFF",
          },
        },
        tooltip: {
          bodyColor: "#FFFFFF",
          titleColor: "#FFFFFF",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    }
    });
}

// Pie Chart for Crypto Market Cap Distribution
function cryptoPieChart() {
    const pieCtx = document.getElementById("cryptoPieChart").getContext("2d")
    const pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: ["Bitcoin", "Ethereum", "Shiba Inu", "Cronos", "Dogecoin"],
            datasets: [
                {
                    label: "Market Cap (in billions)",
                    data: [1757.55, 196.75, 7.4, 2.25, 24.44],
                    backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745', '#6f42c1'],
                },
            ],
        },
        options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#FFFFFF",
          },
        },
        tooltip: {
          bodyColor: "#FFFFFF",
          titleColor: "#FFFFFF",
        },
      },
    }
    })
}

// Bar Chart for Crypto Prices
function cryptoBarChart() {
    const barCtx = document.getElementById("cryptoBarChart").getContext("2d")
    const barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: ["Bitcoin", "Ethereum", "Shiba Inu", "Cronos", "Dogecoin"],
            datasets: [
                {
                    label: "Price (USD)",
                    data: [88570.85, 1630.17, 0.00001256, 0.08216, 0.1639],
                    backgroundColor: '#007bff',
                    borderRadius: 100,
                },
            ],
        },
        options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#FFFFFF",
          },
        },
        tooltip: {
          bodyColor: "#FFFFFF",
          titleColor: "#FFFFFF",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          type: "logarithmic",
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    })
}

// Line Chart for Crypto Price Trends (simulated historical data)
function cryptoLineChart() {
    const lineCtx = document.getElementById("cryptoLineChart").getContext("2d")
    new Chart(lineCtx, {
        type: "line",
        data: {
            labels: [
                "21/04/2025",
                "22/04/2025",
                "23/04/2025",
                "24/04/2025",
                "25/04/2025",
                "26/04/2025",
                "27/04/2025",
                "28/04/2025",
                "29/04/2025",
                "30/04/2025",
            ],
            datasets: [
                {
                    label: "Bitcoin",
                    data: [86765, 87500, 88200, 87900, 88570, 89200, 90100, 89500, 88900, 88570.85],
                    borderColor: "#F7931A",
                    backgroundColor: "rgba(247, 147, 26, 0.1)",
                    fill: false,
                    tension: 0.4,
                },
                {
                    label: "Ethereum",
                    data: [1580, 1610, 1590, 1620, 1640, 1630, 1615, 1625, 1635, 1630.17],
                    borderColor: "#627EEA",
                    backgroundColor: "rgba(98, 126, 234, 0.1)",
                    fill: false,
                    tension: 0.4,
                },
                {
                    label: "Dogecoin",
                    data: [0.155, 0.158, 0.16, 0.157, 0.159, 0.162, 0.165, 0.161, 0.163, 0.1639],
                    borderColor: "#C2A633",
                    backgroundColor: "rgba(194, 166, 51, 0.1)",
                    fill: false,
                    tension: 0.4,
                },
            ],
        },
        options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#FFFFFF",
          },
        },
        tooltip: {
          bodyColor: "#FFFFFF",
          titleColor: "#FFFFFF",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#FFFFFF",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    })
}






