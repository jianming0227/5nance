

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

async function populateEditProfile() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    const response = await fetch(`http://localhost:5000/api/profile/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user");

    const user = await response.json();
    document.getElementById("name").value = user.name || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("contact").value = user.contact || "";
    document.getElementById("dob").value = user.dob?.substring(0, 10) || "";
    document.getElementById("address1").value = user.address1 || "";
    document.getElementById("address2").value = user.address2 || ""; 
    document.getElementById("postcode").value = user.postcode || "";
    document.getElementById("country").value = user.country || "";
    updateState(); // If you're dynamically populating states
    document.getElementById("state").value = user.state || "";
    updateCity();  // If you're dynamically populating cities
    document.getElementById("city").value = user.city || "";

    if (user.avatar)
      document.getElementById("profile-preview").src = user.avatar;
  } catch (err) {
    console.error("Error loading user data:", err);
    alert("Failed to load profile. Please try again.");
  }
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


function populateCountries() {
  const countrySelect = document.getElementById('country');
  Object.keys(stateOptions).forEach(country => {
    const opt = document.createElement('option');
    opt.value = country;
    opt.textContent = country;
    countrySelect.appendChild(opt);
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

document.getElementById("edit-profile-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // prevent page reload

  const userId = localStorage.getItem("userId"); // or fetch dynamically if needed

  const updatedData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    contact: "+60" + document.getElementById("contact").value,
    dob: document.getElementById("dob").value,
    address1: document.getElementById("address1").value,
    address2: document.getElementById("address2").value,
    postcode: document.getElementById("postcode").value,
    country: document.getElementById("country").value,
    state: document.getElementById("state").value,
    city: document.getElementById("city").value,
    // avatar will be handled separately (base64 or FormData)
  };

  try {
    const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
      method: "PUT", // or PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Update failed");

    alert("Profile updated successfully!");
    window.location.href = "view-profile.html"; // redirect

  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Failed to update profile. Try again.");
  }
});


window.onload = function () {
  populateCountries();
  setupAvatarUpload();
  populateEditProfile();
}