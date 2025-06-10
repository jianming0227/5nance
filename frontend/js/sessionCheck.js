function sessionCheck() {
  const POLL_INTERVAL = 60 * 1000; // 1 minute

  // Run immediately, then every minute
  checkSession();
  setInterval(checkSession, POLL_INTERVAL);

  async function checkSession() {
    try {
      const resp = await fetch('/api/auth/session', {
        credentials: 'include',
         cache: 'no-store'
      });

      // 440 = “login timeout” from inactivityChecker
      if (resp.status === 440) {
        return window.location.href = 'session-timeout.html';
      }

      // 200 + { loggedIn: false } = fully signed out
      if (resp.ok) {
        const { loggedIn } = await resp.json();
        if (!loggedIn) {
          return window.location.href = 'log-in-page.html';
        }
      }
    } catch (err) {
      console.error('Session check failed:', err);
      // optionally: force to login page
      // window.location.href = 'log-in-page.html';
    }
  }
}

window.onload = function(){
  sessionCheck();
}
