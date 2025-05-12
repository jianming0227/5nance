document.addEventListener('DOMContentLoaded', function () {
  // The quotes array
  const quotes = [
    {
      author: "Warren Buffett",
      image: "images/warren-buffett.jpg",
      quote: "Do not save what is left after spending; instead spend what is left after saving.",
      description: "Chairman and CEO of Berkshire Hathaway | Net worth: $165B"
    },
    {
      author: "Suze Orman",
      image: "images/suze-orman.jpg",
      quote: "Every dollar you plan today buys freedom for tomorrow.",
      description: "Personal finance expert and author known for empowering individuals to take control of their financial futures."
    },
    {
      author: "Benjamin Franklin",
      image: "images/benjamin-franklin.jpg",
      quote: "An investment in knowledge pays the best interest.",
      description: "Founding Father of the United States, renowned polymath and inventor."
    },
    {
      author: "Dave Ramsey",
      image: "images/dave-ramsey.webp",
      quote: "Take control of your money, or it will control you.",
      description: "Personal finance advisor and radio show host, known for his debt-free living principles."
    },
    {
      author: "Robert Kiyosaki",
      image: "images/robert-kiyosaki.jpeg",
      quote: "Financial freedom is available to those who learn about it and work for it.",
      description: "Author of 'Rich Dad Poor Dad', entrepreneur, and financial educator."
    },
    {
      author: "Charlie Munger",
      image: "images/charlie-munger.jpg",
      quote: "Spend each day trying to be a little wiser than you were when you woke up.",
      description: "Vice Chairman of Berkshire Hathaway, celebrated for his 'worldly wisdom' and emphasis on continuous learning."
    },
    {
      author: "Benjamin Graham",
      image: "images/benjamin-graham.jpg",
      quote: "The investor's chief problem—and even his worst enemy—is likely to be himself.",
      description: "Father of value investing and author of 'The Intelligent Investor', mentor to Warren Buffett."
    },
    {
      author: "Adriano B. Lucatelli",
      image: "images/adriano-lucatelli.jpg",
      quote: "If finance can't improve the lives of people, we have no use for it.",
      description: "Swiss entrepreneur and investor, advocate for ethical finance and fintech innovation."
    },
    {
      author: "Nicole B. Simpson",
      image: "images/nicole-simpson.webp",
      quote: "Stay focused on your long-term goals, not the short-term noise.",
      description: "Founder of Harvest Wealth Financial, emphasizes resilience and long-term planning during economic uncertainty."
    },
    {
      author: "Robert Kiyosaki",
      image: "images/robert-kiyosaki.jpeg",
      quote: "Your future is created by what you do today, not tomorrow.",
      description: "Author of 'Rich Dad Poor Dad', entrepreneur, and financial educator."
    },
  ];

  // Select the carousel container
  const carouselInner = document.getElementById("wisdomCarouselInner");
  const carouselIndicators = document.getElementById("wisdomIndicators");

  if (!carouselInner) {
    console.error("No element with ID 'wisdomCarouselInner' found. Ensure the element exists in your HTML.");
    return;
  }

  quotes.forEach((item, index) => {
    const isActive = index === 0 ? "active" : "";
    const slide = document.createElement("div");
    slide.className = `carousel-item ${isActive}`;
    slide.innerHTML = `
        <div class="wisdom-card">
            <div class="image-wrapper">
            <img src="${item.image}" alt="${item.author}" />
            </div>
            <div class="wisdom-card-content">
            <blockquote>"${item.quote}"</blockquote>
            <div class="author-name">${item.author}</div>
            <div class="description">${item.description}</div>
            </div>
        </div>
        `;

    carouselInner.appendChild(slide);

     // Create carousel indicator
  const indicator = document.createElement("button");
  indicator.type = "button";
  indicator.setAttribute("data-bs-target", "#wisdomCarousel");
  indicator.setAttribute("data-bs-slide-to", index);
  if (index === 0) indicator.classList.add("active");
  carouselIndicators.appendChild(indicator);
});
});
