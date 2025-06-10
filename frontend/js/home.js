const floatElements = document.querySelectorAll('.scroll-fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  document.addEventListener('DOMContentLoaded', function () {
  const startNowLinks = document.querySelectorAll('.start-now-links');
  let redirectTarget = null;

  startNowLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        e.preventDefault(); // Stop navigation
        redirectTarget = link.getAttribute('href'); // Save the intended URL
        const authModal = new bootstrap.Modal(document.getElementById('authModal'));
        authModal.show();
      }
    });
  });

  // Handle Login and Sign Up buttons
  document.getElementById('loginBtn').addEventListener('click', function () {
    window.location.href = 'log-in-page.html';
  });

  document.getElementById('signupBtn').addEventListener('click', function () {
    window.location.href = 'sign-up-page.html';
  });
});

  floatElements.forEach(el => observer.observe(el));
  // This function should run as soon as the page content is loaded
  document.addEventListener('DOMContentLoaded', function() {
  // Find the container for the sign-up and login buttons
  const guestActions = document.getElementById('guest-actions');
  const guestCTA = document.querySelector('.cta-section');

  // Check if a userId is stored from a previous login
  const userId = localStorage.getItem('userId');

  // If a userId exists, it means the user is logged in
  if (userId) {
    // Hide the entire container
    guestActions.style.display = 'none'
    guestCTA.style.setProperty('display', 'none', 'important');
  }
});