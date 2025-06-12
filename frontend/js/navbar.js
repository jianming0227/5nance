document.addEventListener("DOMContentLoaded", async function () {
  const isLoggedIn = localStorage.getItem('userId');

  try {
    const response = await fetch('nav.html');
    const data = await response.text();
    document.getElementById('navbar-placeholder').innerHTML = data;

    //Place DOM-dependent code here, AFTER navbar is rendered
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

    //Logout button
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
      btnLogout.addEventListener("click", async () => {
        try {
          localStorage.removeItem("userId");
          localStorage.removeItem("loggedIn"); // remove localStorage marker

          await fetch("http://localhost:5000/api/logout", {
            method: "POST",
            credentials: "include"
          });

          window.location.href = "log-in-page.html";
        } catch (err) {
          console.error("Logout failed:", err);
          alert("Logout failed. Please try again.");
        }
      });
    }
  } catch (error) {
    console.error("Failed to load navbar:", error);
  }
});