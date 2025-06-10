document.addEventListener("DOMContentLoaded", async function () {
  const isLoggedIn = localStorage.getItem('userId');
  const response = await fetch('nav.html');
  const data = await response.text();
  document.getElementById('navbar-placeholder').innerHTML = data;

  const servicesMenu = document.getElementById('services-menu');
  if (!servicesMenu) {
    console.error("Couldn't find the services-menu element!");
    return;
  }

  if (isLoggedIn) {
    const serviceItems = [
      { name: 'Investment Strategy Recommendation', link: 'AI.html' },
      { name: 'ROI Calculator', link: 'calc.html' },
      { name: 'Goal-Based Planner', link: 'Goal_Based_Investment_Planning.html' },
      { name: 'Market Insight Dashboard', link: 'MarketDashboard.html' }
    ];

    servicesMenu.innerHTML = serviceItems.map(item => `
      <li><a class="dropdown-item" href="${item.link}">${item.name}</a></li>
    `).join('');
  } else {
    servicesMenu.innerHTML = `
      <li><a class="dropdown-item" href="log-in-page.html">Log in to use the services</a></li>
      <li><a class="dropdown-item" href="sign-up-page.html">Don't have an account? Sign up</a></li>
    `;
  }
});
