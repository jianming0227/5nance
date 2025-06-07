// API Configuration
const API_CONFIG = {
  news: {
    key: "2536873d9758434994ac50d94b0fadfa",
    url: "https://newsapi.org/v2/everything?q=finance&language=en&pageSize=15&sortBy=publishedAt"
  },
  // Financial Modeling Prep for comprehensive data
  fmp: {
    key: "yZmuTQcRh0rpjvop1A6CNyhpJ4jpzt4d",
    baseUrl: "https://financialmodelingprep.com/api/v3"
  },
  // CoinGecko for crypto (no API key required)
  coingecko: {
    baseUrl: "https://api.coingecko.com/api/v3"
  },
  // Alpha Vantage for historical data
  alphavantage: {
    key: "SBXZG7NGG2CUW68L",
    baseUrl: "https://www.alphavantage.co/query"
  }
};

// Global variables
let stockCharts = {}
let etfCharts = {}
let cryptoCharts = {}
let refreshInterval
let lastUpdateTime = null
let currentDataType = "stock"
let currentStockData = []
let currentETFData = []
let currentCryptoData = []

// Enhanced symbols with more comprehensive data
const STOCK_SYMBOLS = ["AAPL", "GOOGL", "MSFT", "NVDA", "TSLA", "AMZN", "META", "NFLX"]
const ETF_SYMBOLS = ["SPY", "QQQ", "IWM", "VTI", "VOO", "GLD", "TLT", "EEM"]
const CRYPTO_IDS = ["bitcoin", "ethereum", "binancecoin", "cardano", "solana", "polkadot", "chainlink", "litecoin"]

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", () => {
  loadNews()
  loadStockData()
  setupEventListeners()
  setupAutoRefresh()
  document.getElementById("year").textContent = new Date().getFullYear()
  loadEconomicCalendar()
})

// Setup event listeners
function setupEventListeners() {
  const dropdown = document.getElementById("watchlist-dropdown")
  dropdown.addEventListener("change", function () {
    const selected = this.value
    currentDataType = selected
    showWatchlistGroup(selected)

    if (selected === "stock") {
      loadStockData()
    } else if (selected === "etf") {
      loadETFData()
    } else if (selected === "crypto") {
      loadCryptoData()
    }
  })

  // Refresh button
  document.getElementById("refresh-btn").addEventListener("click", () => {
    refreshCurrentData()
  })

  // Timeframe selectors - Updated with proper functionality
  document.getElementById("stock-timeframe")?.addEventListener("change", (e) => {
    updateStockCharts(e.target.value)
  })

  document.getElementById("etf-timeframe")?.addEventListener("change", (e) => {
    updateETFCharts(e.target.value)
  })

  document.getElementById("crypto-timeframe")?.addEventListener("change", (e) => {
    updateCryptoCharts(e.target.value)
  })

  // Carousel controls
  const articlesWrapper = document.getElementById("articlesWrapper")
  const scrollAmount = 320

  document.getElementById("prevButton").addEventListener("click", () => {
    articlesWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" })
  })

  document.getElementById("nextButton").addEventListener("click", () => {
    articlesWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" })
  })

  // Add table scroll indicators after data is loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        setupTableScrollIndicators()
      }
    })
  })

  // Watch for changes in the watchlist content
  const watchlistContent = document.getElementById("watchlist-content")
  if (watchlistContent) {
    observer.observe(watchlistContent, { childList: true, subtree: true })
  }
}

// Setup auto-refresh
function setupAutoRefresh() {
  // Refresh every 30 seconds
  refreshInterval = setInterval(() => {
    refreshCurrentData()
  }, 30000)
}

// Refresh current data
function refreshCurrentData() {
  updateStatus("loading", "Refreshing...")

  if (currentDataType === "stock") {
    loadStockData()
  } else if (currentDataType === "etf") {
    loadETFData()
  } else if (currentDataType === "crypto") {
    loadCryptoData()
  }
}

// Update status indicator
function updateStatus(status, text) {
  const indicator = document.getElementById("status-indicator")
  const statusText = document.getElementById("status-text")

  indicator.className = `bi bi-circle-fill status-indicator ${status}`
  statusText.textContent = text

  if (status === "connected") {
    lastUpdateTime = new Date()
    document.getElementById("last-update").textContent = lastUpdateTime.toLocaleString()
  }
}

// Show/hide watchlist groups
function showWatchlistGroup(type) {
  const groups = ["stock", "etf", "crypto"]
  groups.forEach((group) => {
    const element = document.getElementById(`${group}-group`)
    if (group === type) {
      element.classList.remove("d-none")
    } else {
      element.classList.add("d-none")
    }
  })
}

// Load news articles
async function loadNews() {
  const wrapper = document.getElementById("articlesWrapper")

  try {
    const response = await fetch(`${API_CONFIG.news.url}&apiKey=${API_CONFIG.news.key}`)
    const data = await response.json()

    if (!data.articles || data.articles.length === 0) {
      wrapper.innerHTML = "<p>No articles found.</p>"
      return
    }

    wrapper.innerHTML = ""

    data.articles.forEach((article) => {
      if (!article.urlToImage || !article.url) return

      const link = document.createElement("a")
      link.href = article.url
      link.target = "_blank"
      link.className = "article-thumbnail"

      const img = document.createElement("img")
      img.src = article.urlToImage
      img.alt = article.title || "Financial Article"

      const title = document.createElement("div")
      title.className = "article-title"
      title.textContent = article.title

      const author = document.createElement("div")
      author.className = "article-author"
      author.textContent = article.author ? `By ${article.author}` : ""

      const date = document.createElement("div")
      date.className = "article-date"
      const publishedDate = new Date(article.publishedAt)
      date.textContent = publishedDate.toLocaleDateString()

      const textContainer = document.createElement("div")
      textContainer.className = "article-info"
      textContainer.appendChild(title)
      textContainer.appendChild(author)
      textContainer.appendChild(date)

      link.appendChild(img)
      link.appendChild(textContainer)
      wrapper.appendChild(link)
    })
  } catch (error) {
    console.error("Error loading news:", error)
    wrapper.innerHTML = "<p class='error'>Error loading articles.</p>"
  }
}

// Load comprehensive stock data
async function loadStockData() {
  const loading = document.querySelector("#stock-group .loading")
  const tableContainer = document.getElementById("stock-table-container")
  const charts = document.getElementById("stock-charts")
  const tbody = document.getElementById("stock-tbody")

  try {
    updateStatus("loading", "Loading stock data...")
    loading.style.display = "block"
    tableContainer.classList.add("d-none")
    charts.classList.add("d-none")

    // Get comprehensive stock data
    const stockData = await getComprehensiveStockData()
    currentStockData = stockData // Store for timeframe updates

    // Populate enhanced table
    tbody.innerHTML = ""
    stockData.forEach((stock) => {
      const row = document.createElement("tr")
      const changeClass = stock.change >= 0 ? "text-success" : "text-danger"
      const changeSymbol = stock.change >= 0 ? "+" : ""
      const percentChangeClass = stock.percentChange >= 0 ? "text-success" : "text-danger"
      const percentChangeSymbol = stock.percentChange >= 0 ? "+" : ""

      row.innerHTML = `
                <td><strong>${stock.symbol}</strong></td>
                <td>${stock.name}</td>
                <td><strong>$${stock.price.toFixed(2)}</strong></td>
                <td class="${changeClass}">${changeSymbol}$${Math.abs(stock.change).toFixed(2)}</td>
                <td class="${percentChangeClass}">${percentChangeSymbol}${stock.percentChange.toFixed(2)}%</td>
                <td>${formatVolume(stock.volume)}</td>
                <td>$${formatMarketCap(stock.marketCap)}</td>
                <td>${stock.peRatio || "N/A"}</td>
                <td>$${stock.high52w?.toFixed(2) || "N/A"}</td>
                <td>$${stock.low52w?.toFixed(2) || "N/A"}</td>
            `
      tbody.appendChild(row)
    })

    // Create comprehensive charts
    await createComprehensiveStockCharts(stockData, "1D")

    loading.style.display = "none"
    tableContainer.classList.remove("d-none")
    charts.classList.remove("d-none")
    updateStatus("connected", "Live")
  } catch (error) {
    console.error("Error loading stock data:", error)
    loading.innerHTML = "<p class='error'>Error loading stock data. Please check your API configuration.</p>"
    updateStatus("disconnected", "Error")
  }
}

// Load comprehensive ETF data
async function loadETFData() {
  const loading = document.querySelector("#etf-group .loading")
  const tableContainer = document.getElementById("etf-table-container")
  const charts = document.getElementById("etf-charts")
  const tbody = document.getElementById("etf-tbody")

  try {
    updateStatus("loading", "Loading ETF data...")
    loading.style.display = "block"
    tableContainer.classList.add("d-none")
    charts.classList.add("d-none")

    const etfData = await getComprehensiveETFData()
    currentETFData = etfData // Store for timeframe updates

    tbody.innerHTML = ""
    etfData.forEach((etf) => {
      const row = document.createElement("tr")
      const changeClass = etf.change >= 0 ? "text-success" : "text-danger"
      const changeSymbol = etf.change >= 0 ? "+" : ""
      const percentChangeClass = etf.percentChange >= 0 ? "text-success" : "text-danger"
      const percentChangeSymbol = etf.percentChange >= 0 ? "+" : ""

      row.innerHTML = `
                <td><strong>${etf.symbol}</strong></td>
                <td>${etf.name}</td>
                <td><strong>$${etf.price.toFixed(2)}</strong></td>
                <td class="${changeClass}">${changeSymbol}$${Math.abs(etf.change).toFixed(2)}</td>
                <td class="${percentChangeClass}">${percentChangeSymbol}${etf.percentChange.toFixed(2)}%</td>
                <td>${formatVolume(etf.volume)}</td>
                <td>$${formatMarketCap(etf.aum)}</td>
                <td>${etf.expenseRatio || "N/A"}%</td>
                <td>${etf.dividendYield || "N/A"}%</td>
                <td class="${etf.ytdReturn >= 0 ? "text-success" : "text-danger"}">${etf.ytdReturn?.toFixed(2) || "N/A"}%</td>
            `
      tbody.appendChild(row)
    })

    await createComprehensiveETFCharts(etfData, "1D")

    loading.style.display = "none"
    tableContainer.classList.remove("d-none")
    charts.classList.remove("d-none")
    updateStatus("connected", "Live")
  } catch (error) {
    console.error("Error loading ETF data:", error)
    loading.innerHTML = "<p class='error'>Error loading ETF data.</p>"
    updateStatus("disconnected", "Error")
  }
}

// Load comprehensive crypto data
async function loadCryptoData() {
  const loading = document.querySelector("#crypto-group .loading")
  const tableContainer = document.getElementById("crypto-table-container")
  const charts = document.getElementById("crypto-charts")
  const tbody = document.getElementById("crypto-tbody")

  try {
    updateStatus("loading", "Loading crypto data...")
    loading.style.display = "block"
    tableContainer.classList.add("d-none")
    charts.classList.add("d-none")

    const response = await fetch(
      `${API_CONFIG.coingecko.baseUrl}/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS.join(",")}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h,24h,7d`,
    )
    const cryptoData = await response.json()
    currentCryptoData = cryptoData // Store for timeframe updates

    tbody.innerHTML = ""
    cryptoData.forEach((crypto, index) => {
      const row = document.createElement("tr")
      const change1hClass = crypto.price_change_percentage_1h_in_currency >= 0 ? "text-success" : "text-danger"
      const change24hClass = crypto.price_change_percentage_24h >= 0 ? "text-success" : "text-danger"
      const change7dClass = crypto.price_change_percentage_7d_in_currency >= 0 ? "text-success" : "text-danger"

      row.innerHTML = `
                <td><strong>#${crypto.market_cap_rank}</strong></td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <img src="${crypto.image}" alt="${crypto.name}" width="24" height="24">
                        <strong>${crypto.name}</strong>
                    </div>
                </td>
                <td><strong>${crypto.symbol.toUpperCase()}</strong></td>
                <td><strong>$${crypto.current_price.toLocaleString()}</strong></td>
                <td class="${change1hClass}">${crypto.price_change_percentage_1h_in_currency?.toFixed(2) || "N/A"}%</td>
                <td class="${change24hClass}">${crypto.price_change_percentage_24h?.toFixed(2) || "N/A"}%</td>
                <td class="${change7dClass}">${crypto.price_change_percentage_7d_in_currency?.toFixed(2) || "N/A"}%</td>
                <td>$${formatMarketCap(crypto.total_volume)}</td>
                <td>$${formatMarketCap(crypto.market_cap)}</td>
                <td>${crypto.circulating_supply ? formatVolume(crypto.circulating_supply) : "N/A"}</td>
            `
      tbody.appendChild(row)
    })

    await createComprehensiveCryptoCharts(cryptoData, "1")

    loading.style.display = "none"
    tableContainer.classList.remove("d-none")
    charts.classList.remove("d-none")
    updateStatus("connected", "Live")
  } catch (error) {
    console.error("Error loading crypto data:", error)
    loading.innerHTML = "<p class='error'>Error loading cryptocurrency data.</p>"
    updateStatus("disconnected", "Error")
  }
}

// Get comprehensive stock data
async function getComprehensiveStockData() {
  // Simulated comprehensive data - replace with real API calls
  return STOCK_SYMBOLS.map((symbol) => ({
    symbol: symbol,
    name: getCompanyName(symbol),
    price: Math.random() * 500 + 50,
    change: (Math.random() - 0.5) * 20,
    percentChange: (Math.random() - 0.5) * 10,
    volume: Math.floor(Math.random() * 100000000),
    marketCap: Math.floor(Math.random() * 2000000000000),
    peRatio: Math.random() * 50 + 5,
    high52w: Math.random() * 600 + 100,
    low52w: Math.random() * 200 + 20,
  }))
}

// Get comprehensive ETF data
async function getComprehensiveETFData() {
  return ETF_SYMBOLS.map((symbol) => ({
    symbol: symbol,
    name: getETFName(symbol),
    price: Math.random() * 400 + 50,
    change: (Math.random() - 0.5) * 10,
    percentChange: (Math.random() - 0.5) * 5,
    volume: Math.floor(Math.random() * 50000000),
    aum: Math.floor(Math.random() * 500000000000),
    expenseRatio: Math.random() * 1,
    dividendYield: Math.random() * 5,
    ytdReturn: (Math.random() - 0.3) * 30,
  }))
}

// Create comprehensive stock charts with timeframe support
async function createComprehensiveStockCharts(data, timeframe = "1D") {
  // Destroy existing charts
  Object.values(stockCharts).forEach((chart) => chart.destroy())
  stockCharts = {}

  const colors = ["#007bff", "#dc3545", "#ffc107", "#28a745", "#6f42c1", "#fd7e14", "#20c997", "#6610f2"]
  const { labels, dataPoints } = getTimeframeData(timeframe)

  // Real-time price chart
  const realTimeCtx = document.getElementById("stockRealTimeChart").getContext("2d")
  stockCharts.realTime = new Chart(realTimeCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: data.slice(0, 5).map((stock, index) => ({
        label: stock.symbol,
        data: generateRealTimePriceData(stock.price, dataPoints),
        borderColor: colors[index],
        backgroundColor: colors[index] + "20",
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#FFFFFF" },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#FFFFFF",
          bodyColor: "#FFFFFF",
        },
      },
      scales: {
        y: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
    },
  })

  // Volume chart
  const volumeCtx = document.getElementById("stockVolumeChart").getContext("2d")
  stockCharts.volume = new Chart(volumeCtx, {
    type: "bar",
    data: {
      labels: data.map((stock) => stock.symbol),
      datasets: [
        {
          label: "Volume",
          data: data.map((stock) => stock.volume),
          backgroundColor: colors,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#FFFFFF",
            callback: (value) => formatVolume(value),
          },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
    },
  })

  // Market cap chart
  const marketCapCtx = document.getElementById("stockMarketCapChart").getContext("2d")
  stockCharts.marketCap = new Chart(marketCapCtx, {
    type: "doughnut",
    data: {
      labels: data.map((stock) => stock.symbol),
      datasets: [
        {
          data: data.map((stock) => stock.marketCap),
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#FFFFFF" },
        },
      },
    },
  })

  // Performance comparison
  const performanceCtx = document.getElementById("stockPerformanceChart").getContext("2d")
  stockCharts.performance = new Chart(performanceCtx, {
    type: "bar",
    data: {
      labels: data.map((stock) => stock.symbol),
      datasets: [
        {
          label: "Performance (%)",
          data: data.map((stock) => stock.percentChange),
          backgroundColor: data.map((stock) => (stock.percentChange >= 0 ? "#28a745" : "#dc3545")),
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
    },
  })
}

// Create comprehensive ETF charts with timeframe support
async function createComprehensiveETFCharts(data, timeframe = "1D") {
  Object.values(etfCharts).forEach((chart) => chart.destroy())
  etfCharts = {}

  const colors = ["#007bff", "#dc3545", "#ffc107", "#28a745", "#6f42c1", "#fd7e14", "#20c997", "#6610f2"]
  const { labels, dataPoints } = getTimeframeData(timeframe)

  // Real-time ETF price chart
  const realTimeCtx = document.getElementById("etfRealTimeChart").getContext("2d")
  etfCharts.realTime = new Chart(realTimeCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: data.slice(0, 5).map((etf, index) => ({
        label: etf.symbol,
        data: generateRealTimePriceData(etf.price, dataPoints),
        borderColor: colors[index],
        backgroundColor: colors[index] + "20",
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#FFFFFF" },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#FFFFFF",
          bodyColor: "#FFFFFF",
        },
      },
      scales: {
        y: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
    },
  })

  // Volume chart
  const volumeCtx = document.getElementById("etfVolumeChart").getContext("2d")
  etfCharts.volume = new Chart(volumeCtx, {
    type: "bar",
    data: {
      labels: data.map((etf) => etf.symbol),
      datasets: [
        {
          label: "Volume",
          data: data.map((etf) => etf.volume),
          backgroundColor: colors,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#FFFFFF",
            callback: (value) => formatVolume(value),
          },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
    },
  })

  // AUM chart
  const aumCtx = document.getElementById("etfAUMChart").getContext("2d")
  etfCharts.aum = new Chart(aumCtx, {
    type: "doughnut",
    data: {
      labels: data.map((etf) => etf.symbol),
      datasets: [
        {
          data: data.map((etf) => etf.aum),
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#FFFFFF" },
        },
      },
    },
  })

  // YTD Performance
  const performanceCtx = document.getElementById("etfPerformanceChart").getContext("2d")
  etfCharts.performance = new Chart(performanceCtx, {
    type: "bar",
    data: {
      labels: data.map((etf) => etf.symbol),
      datasets: [
        {
          label: "YTD Return (%)",
          data: data.map((etf) => etf.ytdReturn),
          backgroundColor: data.map((etf) => (etf.ytdReturn >= 0 ? "#28a745" : "#dc3545")),
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
    },
  })
}

// Create comprehensive crypto charts with timeframe support
async function createComprehensiveCryptoCharts(data, timeframe = "1") {
  Object.values(cryptoCharts).forEach((chart) => chart.destroy())
  cryptoCharts = {}

  const colors = ["#F7931A", "#627EEA", "#F3BA2F", "#0033AD", "#9945FF", "#E84142", "#00D4AA", "#2775CA"]
  const { labels, dataPoints } = getCryptoTimeframeData(timeframe)

  // Real-time crypto price chart
  const realTimeCtx = document.getElementById("cryptoRealTimeChart").getContext("2d")
  cryptoCharts.realTime = new Chart(realTimeCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: data.slice(0, 5).map((crypto, index) => ({
        label: crypto.name,
        data: generateRealTimePriceData(crypto.current_price, dataPoints),
        borderColor: colors[index],
        backgroundColor: colors[index] + "20",
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#FFFFFF" },
        },
      },
      scales: {
        y: {
          type: "logarithmic",
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
    },
  })

  // Volume chart
  const volumeCtx = document.getElementById("cryptoVolumeChart").getContext("2d")
  cryptoCharts.volume = new Chart(volumeCtx, {
    type: "bar",
    data: {
      labels: data.map((crypto) => crypto.symbol.toUpperCase()),
      datasets: [
        {
          label: "24h Volume",
          data: data.map((crypto) => crypto.total_volume),
          backgroundColor: colors,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#FFFFFF",
            callback: (value) => "$" + formatMarketCap(value),
          },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
    },
  })

  // Market dominance
  const marketCapCtx = document.getElementById("cryptoMarketCapChart").getContext("2d")
  cryptoCharts.marketCap = new Chart(marketCapCtx, {
    type: "doughnut",
    data: {
      labels: data.map((crypto) => crypto.name),
      datasets: [
        {
          data: data.map((crypto) => crypto.market_cap),
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#FFFFFF" },
        },
      },
    },
  })

  // 7d Performance
  const performanceCtx = document.getElementById("cryptoPerformanceChart").getContext("2d")
  cryptoCharts.performance = new Chart(performanceCtx, {
    type: "bar",
    data: {
      labels: data.map((crypto) => crypto.symbol.toUpperCase()),
      datasets: [
        {
          label: "7d Change (%)",
          data: data.map((crypto) => crypto.price_change_percentage_7d_in_currency || 0),
          backgroundColor: data.map((crypto) =>
            (crypto.price_change_percentage_7d_in_currency || 0) >= 0 ? "#28a745" : "#dc3545",
          ),
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        x: {
          ticks: { color: "#FFFFFF" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
    },
  })
}

// Get timeframe data for stocks and ETFs
function getTimeframeData(timeframe) {
  const now = new Date()
  let labels = []
  let dataPoints = 0

  switch (timeframe) {
    case "1D":
      dataPoints = 24
      for (let i = dataPoints; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        labels.push(time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))
      }
      break
    case "5D":
      dataPoints = 120 // 5 days * 24 hours
      for (let i = dataPoints; i >= 0; i -= 24) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        labels.push(time.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
      }
      dataPoints = 5
      break
    case "1M":
      dataPoints = 30
      for (let i = dataPoints; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        labels.push(time.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
      }
      break
    case "3M":
      dataPoints = 90
      for (let i = dataPoints; i >= 0; i -= 7) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        labels.push(time.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
      }
      dataPoints = 13
      break
    case "1Y":
      dataPoints = 365
      for (let i = dataPoints; i >= 0; i -= 30) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        labels.push(time.toLocaleDateString("en-US", { month: "short", year: "2-digit" }))
      }
      dataPoints = 12
      break
    default:
      dataPoints = 24
      labels = generateTimeLabels(24)
  }

  return { labels, dataPoints }
}

// Get timeframe data for crypto
function getCryptoTimeframeData(timeframe) {
  const now = new Date()
  let labels = []
  let dataPoints = 0

  switch (timeframe) {
    case "1":
      dataPoints = 24
      for (let i = dataPoints; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        labels.push(time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))
      }
      break
    case "7":
      dataPoints = 7
      for (let i = dataPoints; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        labels.push(time.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
      }
      break
    case "30":
      dataPoints = 30
      for (let i = dataPoints; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        labels.push(time.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
      }
      break
    case "90":
      dataPoints = 90
      for (let i = dataPoints; i >= 0; i -= 7) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        labels.push(time.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
      }
      dataPoints = 13
      break
    case "365":
      dataPoints = 365
      for (let i = dataPoints; i >= 0; i -= 30) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        labels.push(time.toLocaleDateString("en-US", { month: "short", year: "2-digit" }))
      }
      dataPoints = 12
      break
    default:
      dataPoints = 24
      labels = generateTimeLabels(24)
  }

  return { labels, dataPoints }
}

// Utility functions
function formatVolume(volume) {
  if (volume >= 1000000000) {
    return (volume / 1000000000).toFixed(2) + "B"
  } else if (volume >= 1000000) {
    return (volume / 1000000).toFixed(2) + "M"
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + "K"
  }
  return volume.toString()
}

function formatMarketCap(marketCap) {
  if (marketCap >= 1000000000000) {
    return (marketCap / 1000000000000).toFixed(2) + "T"
  } else if (marketCap >= 1000000000) {
    return (marketCap / 1000000000).toFixed(2) + "B"
  } else if (marketCap >= 1000000) {
    return (marketCap / 1000000).toFixed(2) + "M"
  }
  return marketCap.toString()
}

function generateTimeLabels(hours) {
  const labels = []
  const now = new Date()
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    labels.push(time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))
  }
  return labels
}

function generateRealTimePriceData(basePrice, points) {
  const data = []
  let price = basePrice
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 0.02 // ±1% change
    price = price * (1 + change)
    data.push(Number.parseFloat(price.toFixed(2)))
  }
  return data
}

function getCompanyName(symbol) {
  const names = {
    AAPL: "Apple Inc.",
    GOOGL: "Alphabet Inc.",
    MSFT: "Microsoft Corp.",
    NVDA: "NVIDIA Corp.",
    TSLA: "Tesla Inc.",
    AMZN: "Amazon.com Inc.",
    META: "Meta Platforms Inc.",
    NFLX: "Netflix Inc.",
  }
  return names[symbol] || symbol
}

function getETFName(symbol) {
  const names = {
    SPY: "SPDR S&P 500 ETF",
    QQQ: "Invesco QQQ Trust",
    IWM: "iShares Russell 2000",
    VTI: "Vanguard Total Stock Market",
    VOO: "Vanguard S&P 500 ETF",
    GLD: "SPDR Gold Shares",
    TLT: "iShares 20+ Year Treasury Bond",
    EEM: "iShares MSCI Emerging Markets",
  }
  return names[symbol] || symbol
}

// Update chart timeframes - Now properly implemented
function updateStockCharts(timeframe) {
  console.log("Updating stock charts for timeframe:", timeframe)
  if (currentStockData.length > 0) {
    createComprehensiveStockCharts(currentStockData, timeframe)
  }
}

function updateETFCharts(timeframe) {
  console.log("Updating ETF charts for timeframe:", timeframe)
  if (currentETFData.length > 0) {
    createComprehensiveETFCharts(currentETFData, timeframe)
  }
}

function updateCryptoCharts(timeframe) {
  console.log("Updating crypto charts for timeframe:", timeframe)
  if (currentCryptoData.length > 0) {
    createComprehensiveCryptoCharts(currentCryptoData, timeframe)
  }
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// Economic Calendar Section
const indicator = document.getElementById("calendar-status-indicator");
const statusText = document.getElementById("calendar-status-text");

function setCalendarStatus(status) {
  indicator.classList.remove("connected", "disconnected", "loading");

  if (status === "connected") {
    indicator.classList.add("connected");
    statusText.textContent = "Live";
  } else if (status === "loading") {
    indicator.classList.add("loading");
    statusText.textContent = "Loading...";
  } else {
    indicator.classList.add("disconnected");
    statusText.textContent = "Disconnected";
  }
}

async function loadEconomicCalendar() {
  const tbody = document.querySelector("#economic-calendar-table tbody");
  const loadingEl = document.getElementById("calendar-loading");
  const calendarContainer = document.getElementById("economic-calendar-container");

  setCalendarStatus("loading");

  // Show loading, hide table
  loadingEl.classList.remove("d-none");
  calendarContainer.classList.add("d-none");

  try {
    const response = await fetch(
      "https://api.tradingeconomics.com/calendar/country/all?c=guest:guest"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    tbody.innerHTML = ""; // Clear table

    data.forEach(event => {
      const row = document.createElement("tr");
      const date = new Date(event.Date);
      const dateString = date.toLocaleDateString();
      const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      row.innerHTML = `
        <td>${dateString}</td>
        <td>${timeString}</td>
        <td>${event.Currency || event.Country || '-'}</td>
        <td>${event.Event || '-'}</td>
        <td>${event.Importance || '-'}</td>
        <td>${event.Actual || '-'}</td>
        <td>${event.Forecast || '-'}</td>
        <td>${event.Previous || '-'}</td>
      `;

      tbody.appendChild(row);
    });

    // Hide loading, show table
    loadingEl.classList.add("d-none");
    calendarContainer.classList.remove("d-none");
    setCalendarStatus("connected");

    // Optionally update last update time
    document.getElementById("calendar-last-update").textContent = new Date().toLocaleString();

  } catch (error) {
    console.error("Failed to load economic calendar:", error);
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Failed to load data</td></tr>`;
    loadingEl.classList.add("d-none");
    calendarContainer.classList.remove("d-none");
    setCalendarStatus("disconnected");
  }
}

document.getElementById("calendar-refresh-btn").addEventListener("click", () => {
  loadEconomicCalendar();
});

