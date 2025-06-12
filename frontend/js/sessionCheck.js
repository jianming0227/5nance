const currentPage = window.location.pathname.split('/').pop();
if (currentPage === 'session-timeout.html') {
  console.log('Skipping sessionCheck.js on session-timeout.html');
  
} else {

  console.log("sessionCheck.js loaded successfully!");

  let sessionInterval = setInterval(checkSession, 60 * 1000); // store interval so we can clear it

  async function checkSession() {
    try {
      const resp = await fetch('/api/auth/session', {
        credentials: 'include',
        cache: 'no-store'
      });

      console.log("Checking session... Response Status:", resp.status);

      if (resp.status === 440) {
        // clearInterval(sessionInterval);
        console.log("Session inactive. Redirecting to session-timeout.html");
        // Save current URL before redirecting
        sessionStorage.setItem('preTimeoutURL', window.location.href);
        window.location.href = 'session-timeout.html';
        return;
      }

      // Fully logged out scenario
      if (resp.ok) {
        const { loggedIn } = await resp.json();
        console.log("Session response data:", loggedIn);

        if (!loggedIn) {
          // clearInterval(sessionInterval);
          console.log("Session fully logged out. Redirecting to login.");
          window.location.href = 'log-in-page.html';
          return;
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
    }
  }
}