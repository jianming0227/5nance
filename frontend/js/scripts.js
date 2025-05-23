
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
    const countrySelect = document.getElementById('country');
    // Populate country dropdown dynamically
    Object.keys(stateOptions).forEach(country => {
        const opt = document.createElement('option');
        opt.value = country;
        opt.textContent = country;
        countrySelect.appendChild(opt);
    });
}

function updateState() {
    const country = document.getElementById('country').value;
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');

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

function prefillProfileForm() {
  const data = JSON.parse(localStorage.getItem("profileData"));
  if (data) {
    document.getElementById("name").value = data.name || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("contact").value = data.contact?.replace(/^\+\d{1,3}/, "") || "";
    document.getElementById("dob").value = data.dob || "";
    document.getElementById("address1").value = data.address1 || "";
    document.getElementById("address2").value = data.address2 || "";
    document.getElementById("postcode").value = data.postcode || "";
    document.getElementById("country").value = data.country || "";
    updateState();
    document.getElementById("state").value = data.state || "";
    updateCity();
    document.getElementById("city").value = data.city || "";
    document.getElementById("password").value = data.password || "";
    document.getElementById("profile-preview").src = data.avatar || "images/profile-pic.png";

    const countryCodeMatch = data.contact?.match(/^\+(\d{1,3})/);
    if (countryCodeMatch) {
      document.getElementById("country-code").value = `+${countryCodeMatch[1]}`;
    }
  }
}

function handleFormSubmit() {
  document.querySelector('.profile-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const updatedData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      contact: `${document.getElementById("country-code").value}${document.getElementById("contact").value}`,
      dob: document.getElementById("dob").value,
      address1: document.getElementById("address1").value,
      address2: document.getElementById("address2").value,
      postcode: document.getElementById("postcode").value,
      state: document.getElementById("state").value,
      city: document.getElementById("city").value,
      country: document.getElementById("country").value,
      password: document.getElementById("password").value,
      avatar: document.getElementById("profile-preview").src
    };
    localStorage.setItem("profileData", JSON.stringify(updatedData));
    alert("Profile updated successfully!");
    window.location.href = "view-profile.html";
  });
}

function setupAvatarUpload() {
  document.getElementById("avatar-upload")?.addEventListener("change", function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profile-preview").src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
  });
}

function populateViewProfile() {
  const data = JSON.parse(localStorage.getItem("profileData"));
  if (data) {
    document.querySelector(".readonly-name").textContent = data.name || "-";
    document.querySelector(".readonly-email").textContent = data.email || "-";
    document.querySelector(".readonly-phone").textContent = data.contact || "-";
    document.querySelector(".readonly-dob").textContent = data.dob || "-";
    document.querySelector(".readonly-address-1").textContent = data.address1 || "-";
    document.querySelector(".readonly-address-2").textContent = data.address2 || "-";
    document.querySelector(".readonly-postcode").textContent = data.postcode || "-";
    document.querySelector(".readonly-city").textContent = data.city || "-";
    document.querySelector(".readonly-state").textContent = data.state || "-";
    document.querySelector(".readonly-country").textContent = data.country || "-";
    document.getElementById("password").value = data.password || "";
    document.getElementById("view-avatar")?.setAttribute("src", data.avatar || "images/profile-pic.png");
  }
}

window.onload = function () {
  populateCountries();
  prefillProfileForm();
  handleFormSubmit();
  setupAvatarUpload();
  populateViewProfile();
};



//Toggle between password visibility -- log-in-page.html
function pwVisibility() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
}

//validate log in
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".login-button");

    loginButton.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("myInput").value.trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        // Get user data from localStorage
        const storedData = JSON.parse(localStorage.getItem("profileData"));

        if (!storedData) {
            alert("No user data found. Please sign up first.");
            return;
        }

        // Validate email and password
        if (storedData.email !== email || storedData.password !== password) {
            alert("Invalid email or password.");
            return;
        }

        // Login successful
        alert("Login successful!");
        window.location.href = "dashboard.html";
    });
});

function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("myInput").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return false;
    }

    const storedData = JSON.parse(localStorage.getItem("profileData"));

    if (!storedData) {
        alert("No user data found. Please sign up first.");
        return false;
    }

    if (storedData.email !== email || storedData.password !== password) {
        alert("Invalid email or password.");
        return false;
    }

  showToast("Login successful!", () => {
    window.location.href = "index.html";
  });
    return false; // prevent form submission default
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
