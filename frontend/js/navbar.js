// With different dropdown of service b4 and after login
// document.addEventListener("DOMContentLoaded", function () {
//   // Check if user is logged in
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // 'true' means logged in

//   const servicesMenu = document.getElementById("services-menu");

//   if (isLoggedIn) {
//     // Add services items if logged in
//     servicesMenu.innerHTML = `
//       <li><a class="dropdown-item" href="/service1">Investment Strategy Recommendation</a></li>
//       <li><a class="dropdown-item" href="/service2">ROI Calculator</a></li>
//       <li><a class="dropdown-item" href="/service3">Goal-Based Planner</a></li>
//       <li><a class="dropdown-item" href="/service4">Market Insight Dashboard</a></li>
//     `;
//   } else {
//     // Add a default message or hide the menu if not logged in
//     servicesMenu.innerHTML = `
//       <li><a class="dropdown-item" href="log-in-page.html">Please log in to view services</a></li>
//     `;
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  const servicesMenu = document.getElementById('services-menu');

  // Define your service items here
  const serviceItems = [
    { name: 'Investment Strategy Recommendation', link: 'AI.html' },
    { name: 'ROI Calculator', link: 'calc.html' },
    { name: 'Goal-Based Planner', link: 'Goal_Based_Investment_Planning.html' },
    { name: 'Market Insight Dashboard', link: 'MarketDashboard.html' }
  ];

  // Generate dropdown items
  serviceItems.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.classList.add('dropdown-item');
    a.href = item.link;
    a.textContent = item.name;
    li.appendChild(a);
    servicesMenu.appendChild(li);
  });
});


