

// Dropdown country/state/city options
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

function populateCountries() {
  const countrySelect = document.getElementById('signup-country');
  Object.keys(stateOptions).forEach(country => {
    const opt = document.createElement('option');
    opt.value = country;
    opt.textContent = country;
    countrySelect.appendChild(opt);
  });
}

function updateState() {
  const country = document.getElementById('signup-country').value;
  const stateSelect = document.getElementById('signup-state');
  const citySelect = document.getElementById('signup-city');
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
  const state = document.getElementById('signup-state').value;
  const citySelect = document.getElementById('signup-city');
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

function showToast(message, callback) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    if (callback) callback();
  }, 2000);
}

async function saveSignUpData() {
  const userData = {
    name: document.getElementById("signup-name").value,
    email: document.getElementById("signup-email").value,
    contact: `${document.getElementById("signup-country-code").value}${document.getElementById("contact").value}`,
    dob: document.getElementById("signup-dob").value,
    country: document.getElementById("signup-country").value,
    state: document.getElementById("signup-state").value,
    city: document.getElementById("signup-city").value,
    address1: document.getElementById("signup-address1")?.value || "",
    address2: document.getElementById("signup-address2")?.value || "",
    postcode: document.getElementById("signup-postcode")?.value || "",
    password: document.getElementById("signup-password").value,
    avatar: "images/profile-pic.png"
  };

  try {
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("userId", result.userId);
      showToast("Sign-up successful!", () => {
        window.location.href = "input_form.html";
      });
    } else {
      showToast(result.message || "Sign-up failed");
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    showToast("Error during sign-up");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  populateCountries();

  const form = document.getElementById("signup-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevents page reload
    saveSignUpData();   // call your function
  });
});

