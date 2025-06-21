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

async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  // Adjust the endpoint as per your backend
  const response = await fetch('http://localhost:5000/api/user/upload-avatar', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) throw new Error('Failed to upload avatar');
  return response.json(); // Should return { imageUrl: '...' }
}

document.getElementById("avatar-upload").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  if (file) {
    try {
      const result = await uploadAvatar(file);
      // Update the preview immediately
      document.getElementById("profile-preview").src = "/" + result.imageUrl;
      // Optionally, store imageUrl for later use when saving profile
      window.latestAvatarUrl = result.imageUrl;
    } catch (err) {
      alert('Image upload failed');
    }
  }
});

document.getElementById("edit-profile-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userId = localStorage.getItem("userId"); 
  // Gather form data
  const profileData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    contact: document.getElementById("contact").value,
    dob: document.getElementById("dob").value,
    address1: document.getElementById("address1").value,
    address2: document.getElementById("address2").value,
    postcode: document.getElementById("postcode").value,
    country: document.getElementById("country").value,
    state: document.getElementById("state").value, 
    city: document.getElementById("city").value,
    avatar: window.latestAvatarUrl // Use the uploaded image URL
  };

  // Save profile to backend
  const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
    credentials: 'include'
  });

  if (response.ok) {
    // Fetch latest profile to update UI
    await fetchAndUpdateProfile();
    window.location.href = "view-profile.html";
  } else {
    alert('Failed to save profile');
  }
});

async function fetchAndUpdateProfile() {
  const userId = localStorage.getItem("userId");
  const response = await fetch(`http://localhost:5000/api/profile/${userId}`, { credentials: 'include' });
  if (response.ok) {
    const profile = await response.json();
    // Update form fields
    document.getElementById("name").value = profile.name || '';
    document.getElementById("email").value = profile.email || '';
    document.getElementById("contact").value = profile.contact || '';
    document.getElementById("dob").value = profile.dob ? profile.dob.substring(0, 10) : '';
    document.getElementById("address1").value = profile.address1 || '';
    document.getElementById("address2").value = profile.address2 || '';
    document.getElementById("postcode").value = profile.postcode || '';
    document.getElementById("country").value = profile.country || '';
    document.getElementById("state").value = profile.state || '';
    document.getElementById("city").value = profile.city || '';
    // Update profile image
    document.getElementById("profile-preview").src = profile.avatar || 'images/profile-pic.png';
  }
}

window.onload = function () {
  populateCountries();
  populateEditProfile();
}