function sha256(str) {
  return CryptoJS.SHA256(str).toString();
}

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

function populateCountries() {
    const countrySelect = document.getElementById('signup-country');
    // Populate country dropdown dynamically
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
    const state = document.getElementById('signup-state').value;
    const citySelect = document.getElementById('signup-city');

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

function saveSignUpData() {
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
    password: sha256(document.getElementById("signup-password").value),
    avatar: "images/profile-pic.png"
  };

  localStorage.setItem("profileData", JSON.stringify(userData));
  
  showToast("Sign-up successful!", () => {
    window.location.href = "login.html";
  });
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

window.onload = function () {
    populateCountries();

    // Attach event listener to sign-up form submission
    document.getElementById('signup-form').addEventListener('submit', function (e) {
        e.preventDefault();
        saveSignUpData();
    });
};
