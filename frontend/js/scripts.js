
//select country, state and city for sign-up-page.html
const stateOptions = {
  "Malaysia": [
    "Selangor", "Pulau Pinang", "Sabah", "Pahang", "Perak",
    "Perlis", "Terengganu", "Kedah", "Johor", "Kelantan",
    "Sarawak", "Melaka", "Negeri Sembilan", "Wilayah Persekutuan"
  ]
};

const cityOptions = {
  "Selangor": ["Shah Alam", "Petaling Jaya", "Klang", "Subang Jaya", "Kajang"],
  "Pulau Pinang": ["George Town", "Butterworth", "Bayan Lepas", "Bukit Mertajam"],
  "Sabah": ["Kota Kinabalu", "Sandakan", "Tawau", "Lahad Datu", "Keningau"],
  "Pahang": ["Kuantan", "Temerloh", "Bentong", "Jerantut"],
  "Perak": ["Ipoh", "Taiping", "Teluk Intan", "Sitiawan"],
  "Perlis": ["Kangar", "Arau", "Padang Besar"],
  "Terengganu": ["Kuala Terengganu", "Dungun", "Kemaman", "Marang"],
  "Kedah": ["Alor Setar", "Sungai Petani", "Kulim", "Langkawi"],
  "Johor": ["Johor Bahru", "Batu Pahat", "Kluang", "Muar"],
  "Kelantan": ["Kota Bharu", "Pasir Mas", "Tumpat", "Tanah Merah"],
  "Sarawak": ["Kuching", "Miri", "Sibu", "Bintulu"],
  "Melaka": ["Melaka City", "Alor Gajah", "Jasin"],
  "Negeri Sembilan": ["Seremban", "Port Dickson", "Nilai"],
  "Wilayah Persekutuan": ["Kuala Lumpur", "Putrajaya", "Labuan"]
};

function updateState() {
  const country = document.getElementById('country').value;
  const stateSelect = document.getElementById('state');
  const citySelect = document.getElementById('city');
  if (!stateSelect || !citySelect) return;

  // Clear state and city options
  stateSelect.innerHTML = '<option value="">--Select State--</option>';
  citySelect.innerHTML = '<option value="">--Select City--</option>';

  if (stateOptions[country]) {
    stateOptions[country].forEach(state => {
      const opt = document.createElement('option');
      opt.value = state;
      opt.textContent = state;
      stateSelect.appendChild(opt);
    });
  }
}

function updateCity() {
  const state = document.getElementById('state').value;
  const citySelect = document.getElementById('city');
  if (!citySelect) return;


  // Clear city options
  citySelect.innerHTML = '<option value="">--Select City--</option>';

  if (cityOptions[state]) {
    cityOptions[state].forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }
}

function populateCountries() {
  const countrySelect = document.getElementById('signup-country');
  Object.keys(stateOptions).forEach(country => {
    const opt = document.createElement('option');
    opt.value = country;
    opt.textContent = country;
    countrySelect.appendChild(opt);
  });
}

//Toggle between password visibility -- log-in-page.html
function pwVisibility() {
  var x = document.getElementById("myInput");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("myInput").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return false;
  }

  const loginData = { email, password };

  fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(data => { throw new Error(data.message); });
      }
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("userId", data.profile._id); // Just save ID
      showToast(data.message, () => {
        window.location.href = "index.html";
      });
    })
    .catch((err) => {
      showToast("Login failed: " + err.message);
    });

  return false; // Prevent default form submission
}



function showToast(message, callback) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show"); // Add 'show' class to make it visible

  setTimeout(() => {
    toast.classList.remove("show"); // Remove 'show' class after 2 seconds
    if (callback) callback(); // If a callback is provided, call it
  }, 2000); // Toast shows for 2 seconds
}

